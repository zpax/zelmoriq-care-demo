# Zelmoriq Care Dev hosting

- URL: https://dev.zelmoriq.zpaxapps.com
- AWS account: 654654576032; profile: shared-services; region: us-east-1
- CloudFormation stack: zelmoriq-dev
- ECS cluster/service: zelmoriq-dev; one Fargate task (0.5 vCPU, 1 GB)
- Image repository: zelmoriq-dev; current tag: redesign-home
- Build project: zelmoriq-dev
- Private source bucket: zelmoriq-dev-build-654654576032
- Secret: zelmoriq-dev/sso-client-secret (in AWS Secrets Manager)
- DNS zone: Z0053909OLE4NYGG1XL8

The stack provides an isolated VPC, two subnets, an HTTPS load balancer, DNS record, validated ACM certificate, task execution role, and seven-day application logs. Only the load balancer can reach the app port. HTTP redirects to HTTPS. No SSH access is configured.

This demo deliberately runs one task because its login transactions and sessions are held in memory. Restarts and deployments sign users out. Rolling deployments stop the previous task before starting its replacement, causing a brief outage. Use shared session storage before scaling beyond one task or enabling overlapping deployments.

The /tile route is a public preview with explicitly fictional sample counts. The full workspace requires Dev SSO. The hosted SSO callback is /auth/callback; the local callback remains registered.

The source archive and container build exclude .env files. The SSO secret is injected into the container at runtime. Do not place secrets into the template or container image.

Resources incur ongoing AWS charges. The CloudFormation stack manages hosting resources; the source bucket, image repository, build project/role, and Secrets Manager secret were created separately and require separate cleanup when retiring the demo.
