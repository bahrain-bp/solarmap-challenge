import { CfnMap } from "aws-cdk-lib/aws-location";
import { StackContext } from "sst/constructs";



export function MapStack({ stack }: StackContext) {

    const mapName = stack.stage === "prod" ? "prod-map" : stack.stage + "-dev-map";
    const cfnMap = new CfnMap(stack, "Map", {
        configuration: {
            style: "HybridHereExploreSatellite",
        },
        mapName: mapName,
    }) 

    stack.addOutputs({
        cfnMap: cfnMap.attrMapArn,
    })


}