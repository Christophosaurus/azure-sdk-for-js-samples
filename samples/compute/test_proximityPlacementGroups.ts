import { ComputeManagementClient, ProximityPlacementGroup,UpdateResource } from "@azure/arm-compute";
import {DefaultAzureCredential} from "@azure/identity";

const subscriptionId = process.env.subscriptionId;
const credential = new DefaultAzureCredential();

/**
 * Class Test_proximityPlacementGroups.
 */
class Test_proximityPlacementGroups{
    private compute_client = new ComputeManagementClient(credential, subscriptionId);
    private resourceName = "resourceName";
    private proximityPlacementGroupName = "proximiityplacementgroups";
    
    //create or update
    public async test_createOrUpdate() {
        const parameter: ProximityPlacementGroup = {
            location: "eastus",
            proximityPlacementGroupType: "Standard"
        };
        await this.compute_client.proximityPlacementGroups.createOrUpdate(this.resourceName,this.proximityPlacementGroupName,parameter).then(
            response => {
                console.log(response)
            }
        );
    };

    //get
    public async test_get(){
        await this.compute_client.proximityPlacementGroups.get(this.resourceName,this.proximityPlacementGroupName).then(
            response => {
                console.log(response)
            }
        );
    }
    
    //listByResourceGroup
    public async test_listByResourceGroup(){
        for await (let item of this.compute_client.proximityPlacementGroups.listByResourceGroup(this.resourceName)){
            console.log(item)
        };
    }

    //listBySubscriptio
    public async test_listBySubscriptio(){
        for await (let item of this.compute_client.proximityPlacementGroups.listBySubscription()){
            console.log(item)
        };
    }

    //update
    public async test_update(){
        const parameter: UpdateResource = {
            tags:{
                location:"eastus",
                proximityPlacementGroupType: "Standard"
            }
        };
        await this.compute_client.proximityPlacementGroups.update(this.resourceName,this.proximityPlacementGroupName,parameter).then(
            response => {
                console.log(response)
            }
        );
    }
    //delete
    public async test_delete(){
        await this.compute_client.proximityPlacementGroups.delete(this.resourceName,this.proximityPlacementGroupName).then(
            response => {
                console.log(response)
            }
        );
    }       
}

// const t = new Test_proximityPlacementGroups();
// console.log(t.test_delete())