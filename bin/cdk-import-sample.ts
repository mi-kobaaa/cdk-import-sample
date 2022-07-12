#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkImportSampleStack } from '../lib/cdk-import-sample-stack';

const app = new cdk.App();
new CdkImportSampleStack(app, 'CdkImportSampleStack', {
  env: {region: 'ap-northeast-1'}
});