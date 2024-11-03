#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkStack } from '../lib/cdk-stack';

// Erstelle die CDK-App
const app = new cdk.App();

// Umgebungseinstellungen (kann angepasst werden, z. B. für verschiedene Accounts/Regionen)
const env = { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION };

// Dev Stage
new CdkStack(app, 'Dev', {
  stage: 'dev',
  env,
});

// Staging Stage
new CdkStack(app, 'Staging', {
  stage: 'staging',
  env,
});

// Prod Stage
new CdkStack(app, 'Prod', {
  stage: 'prod',
  env,
});
