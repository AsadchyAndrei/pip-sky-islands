#!/usr/bin/env bash
# Pip's Sky Islands: one-time server setup. Run it in Google Cloud Shell (console.cloud.google.com,
# the >_ button at the top right) after the Firebase project is on the Blaze plan:
#
#   bash <(curl -sL https://raw.githubusercontent.com/AsadchyAndrei/pip-sky-islands/main/tools/setup-server.sh)
#
# What it does (safe to run again):
#   1. lets GitHub Actions of the AsadchyAndrei/pip-sky-islands repository (main branch only) deploy
#      the Firestore rules and server functions, through Workload Identity Federation: no keys are made;
#   2. stores the Resend API key (for emails) in Secret Manager, if you paste one;
#   3. adds a $10 monthly budget alert to the billing account, so a surprise bill can't happen quietly.
set -euo pipefail
P=pip-sky-islands
N=911404168229
REPO=AsadchyAndrei/pip-sky-islands
SA=pip-deployer@$P.iam.gserviceaccount.com
say(){ printf '\n\033[1;34m%s\033[0m\n' "$*"; }

gcloud config set project "$P" >/dev/null
if [ "$(gcloud billing projects describe "$P" --format='value(billingEnabled)' 2>/dev/null)" != "True" ]; then
  echo "The project is not on the Blaze plan yet. Open https://console.firebase.google.com/project/$P/usage/details, choose Blaze, then run this again."
  exit 1
fi

say "1/4 Turning on the Google Cloud services the deploy needs..."
gcloud services enable iam.googleapis.com iamcredentials.googleapis.com sts.googleapis.com \
  cloudresourcemanager.googleapis.com serviceusage.googleapis.com secretmanager.googleapis.com \
  billingbudgets.googleapis.com --quiet

say "2/4 The deploy account and GitHub sign-in..."
gcloud iam service-accounts describe "$SA" >/dev/null 2>&1 || \
  gcloud iam service-accounts create pip-deployer --display-name="Deploys Pip's Sky Islands from GitHub" --quiet
# a brand-new account takes a little while to be known everywhere: retry each step
retry(){ for i in 1 2 3 4 5 6 7 8 9 10 11 12; do "$@" >/dev/null 2>&1 && return 0; echo "  waiting for Google Cloud to catch up..."; sleep 10; done; "$@" >/dev/null; }
for R in roles/editor roles/resourcemanager.projectIamAdmin roles/secretmanager.admin roles/iam.serviceAccountUser \
         roles/run.admin roles/cloudfunctions.admin roles/firebaserules.admin roles/eventarc.admin roles/cloudscheduler.admin; do
  retry gcloud projects add-iam-policy-binding "$P" --member="serviceAccount:$SA" --role="$R" --condition=None --quiet
done
echo "  permissions set."
gcloud iam workload-identity-pools describe github --location=global >/dev/null 2>&1 || \
  gcloud iam workload-identity-pools create github --location=global --display-name="GitHub Actions" --quiet
gcloud iam workload-identity-pools providers describe github --workload-identity-pool=github --location=global >/dev/null 2>&1 || \
  gcloud iam workload-identity-pools providers create-oidc github --workload-identity-pool=github --location=global \
    --issuer-uri="https://token.actions.githubusercontent.com" \
    --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository,attribute.ref=assertion.ref" \
    --attribute-condition="assertion.repository=='$REPO' && assertion.ref=='refs/heads/main'" --quiet
retry gcloud iam service-accounts add-iam-policy-binding "$SA" --role=roles/iam.workloadIdentityUser \
  --member="principalSet://iam.googleapis.com/projects/$N/locations/global/workloadIdentityPools/github/attribute.repository/$REPO" --quiet
echo "  GitHub sign-in set." 

say "3/4 Emails (Resend)"
echo "Paste your Resend API key (it starts with re_; https://resend.com/api-keys → Create API key, 'Sending access')."
echo "The key is not shown while you paste. Press Enter without a key to skip: the app works, emails just wait."
read -rsp "Resend API key: " KEY; echo
if [ -n "${KEY:-}" ]; then
  if gcloud secrets describe RESEND_API_KEY >/dev/null 2>&1; then printf '%s' "$KEY" | gcloud secrets versions add RESEND_API_KEY --data-file=- --quiet >/dev/null
  else printf '%s' "$KEY" | gcloud secrets create RESEND_API_KEY --data-file=- --replication-policy=automatic --quiet >/dev/null; fi
  echo "Saved."
elif ! gcloud secrets describe RESEND_API_KEY >/dev/null 2>&1; then
  printf 'none' | gcloud secrets create RESEND_API_KEY --data-file=- --replication-policy=automatic --quiet >/dev/null
  echo "Skipped. Run this script again later to add the key."
fi

say "4/4 A budget alert..."
BA=$(gcloud billing projects describe "$P" --format='value(billingAccountName)' | sed 's#billingAccounts/##')
if gcloud billing budgets list --billing-account="$BA" --format='value(displayName)' 2>/dev/null | grep -qx "Pip's Sky Islands"; then echo "Already there."
else
  gcloud billing budgets create --billing-account="$BA" --display-name="Pip's Sky Islands" --budget-amount=10USD \
    --filter-projects="projects/$P" --threshold-rule=percent=0.5 --threshold-rule=percent=1.0 --quiet >/dev/null \
    && echo "You get an email when the month's bill reaches \$5 and \$10." \
    || echo "Could not add it (not critical). You can add one at https://console.cloud.google.com/billing/budgets"
fi

say "Done! Tell Claude the setup is finished: the next deploy from GitHub turns the server on."
