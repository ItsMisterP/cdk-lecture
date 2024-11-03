import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CdkStack } from './cdk-stack';

interface StageProps extends cdk.StageProps {
    stage: string;
  }

export class Stage extends cdk.Stage {
    constructor(scope: Construct, id: string, props: StageProps) {
        super(scope, id, props);

        new CdkStack(this, `Application-${props.stage}`, {
            stage: props.stage,
            env: props.env,
        })
    }
}