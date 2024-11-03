import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

interface StackProps extends cdk.StackProps {
  stage: string;
}

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    // S3 Bucket für das Frontend
    const frontendBucket = new s3.Bucket(this, 'FrontendBucket', {
      bucketName: `${props.stage}-frontend-bucket`,
      websiteIndexDocument: 'index.html',
      publicReadAccess: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS, // Nur ACLs blockieren, öffentlicher Zugriff ist erlaubt
    });

    const backendFunction = new NodejsFunction(this, 'BackendFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      functionName: `${props.stage}-BackendFunction`,
      entry: path.join('./backend/src/handler.ts'), // Pfad zur TypeScript-Datei
      handler: 'handler',
      environment: {
        BUCKET_NAME: frontendBucket.bucketName,
      },
    });

    // API Gateway für die Lambda-Funktion
    const api = new apigateway.LambdaRestApi(this, 'BackendAPI', {
      handler: backendFunction,
      proxy: false,
    });

    const todosResource = api.root.addResource('todos');
    todosResource.addMethod('GET');
    todosResource.addMethod('POST');
    todosResource.addResource('{id}').addMethod('DELETE');

    // Berechtigungen für die Lambda-Funktion
    frontendBucket.grantReadWrite(backendFunction);
  }
}
