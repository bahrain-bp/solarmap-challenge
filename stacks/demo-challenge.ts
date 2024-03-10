import * as cdk from 'aws-cdk-lib';
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as cloudfrontOrigins from "aws-cdk-lib/aws-cloudfront-origins";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3Deploy from "aws-cdk-lib/aws-s3-deployment";
import * as path from "path";
import { StackContext } from 'sst/constructs';

export function demoChallenge({ stack }: StackContext) {

    
        const bucket = new s3.Bucket(this, "demoWebsiteBucket", {
          bucketName:  'demochallenge',
          blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
          publicReadAccess: false,
          removalPolicy: cdk.RemovalPolicy.DESTROY,
        });


        const distribution = new cloudfront.Distribution(this, "demoWebsiteDistribution", {
            defaultBehavior: {
              origin: new cloudfrontOrigins.S3Origin(bucket),
              viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            },
            defaultRootObject: "index.html", 
          });

          new s3Deploy.BucketDeployment(this, 'demoBucketDeployment', {
            sources: [
              s3Deploy.Source.asset(path.join('stacks/demo-website')),
            ],
            destinationBucket: bucket
          });
      
    }
