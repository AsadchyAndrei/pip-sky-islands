#!/usr/bin/env bash
# Run by the GitHub deploy (as pip-deployer): turns on the services the functions use and gives the
# functions' runtime account the permissions it needs. Safe to run on every deploy.
set -euo pipefail
P=pip-sky-islands
N=911404168229
RUNTIME=$N-compute@developer.gserviceaccount.com
gcloud config set project "$P" >/dev/null
gcloud services enable cloudfunctions.googleapis.com run.googleapis.com cloudbuild.googleapis.com \
  artifactregistry.googleapis.com cloudscheduler.googleapis.com eventarc.googleapis.com pubsub.googleapis.com \
  secretmanager.googleapis.com fcm.googleapis.com firebaserules.googleapis.com firestore.googleapis.com \
  logging.googleapis.com storage.googleapis.com classroom.googleapis.com --quiet
for R in roles/cloudbuild.builds.builder roles/datastore.user roles/firebaseauth.viewer roles/firebasecloudmessaging.admin \
         roles/eventarc.eventReceiver roles/run.invoker roles/logging.logWriter roles/artifactregistry.writer roles/storage.objectViewer; do
  gcloud projects add-iam-policy-binding "$P" --member="serviceAccount:$RUNTIME" --role="$R" --condition=None --quiet >/dev/null
done
gcloud projects add-iam-policy-binding "$P" --member="serviceAccount:service-$N@gcp-sa-pubsub.iam.gserviceaccount.com" \
  --role=roles/iam.serviceAccountTokenCreator --condition=None --quiet >/dev/null || true
gcloud secrets describe RESEND_API_KEY >/dev/null 2>&1 || printf 'none' | gcloud secrets create RESEND_API_KEY --data-file=- --replication-policy=automatic --quiet
echo "Project ready."
