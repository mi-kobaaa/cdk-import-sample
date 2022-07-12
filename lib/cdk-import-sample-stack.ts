import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";
// import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export class CdkImportSampleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, "Vpc", {
      maxAzs: 2,
      natGateways: 1,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: "Public",
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: "Private",
          subnetType: ec2.SubnetType.PRIVATE_WITH_NAT,
        },
      ],
    });

    const cluster = new ecs.Cluster(this, "Cluster", {
      vpc: vpc,
      clusterName: "ecs-sample-cluster",
    });

    const taskDefinition = new ecs.FargateTaskDefinition(
      this,
      "TaskDefinition"
    );

    const container = taskDefinition.addContainer("web", {
      image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
      memoryLimitMiB: 512,
      cpu: 256,
      logging: ecs.LogDriver.awsLogs({
        streamPrefix: "ecs-sample",
      }),
    });

    container.addPortMappings({
      containerPort: 80,
    });

    const service = new ecs.FargateService(this, "Service", {
      cluster: cluster,
      taskDefinition: taskDefinition,
      desiredCount: 2,
      serviceName: `ecs-sample-service`,
    });

    const alb = new elbv2.ApplicationLoadBalancer(this, "Alb", {
      vpc: vpc,
      internetFacing: true,
      loadBalancerName: "ecs-sample-alb",
    });

    const listener = alb.addListener("Listener", {
      port: 80,
      protocol: elbv2.ApplicationProtocol.HTTP,
    });

    listener.addTargets("TargetGroup", {
      protocol: elbv2.ApplicationProtocol.HTTP,
      port: 3000,
      targets: [service],
    });

    // s3の定義を追加
    // const bucket = new s3.Bucket(this, "AlbBucket");

    // 取り込んだbucketにalbのログを取り込む
    // alb.logAccessLogs(bucket);
  }
}
