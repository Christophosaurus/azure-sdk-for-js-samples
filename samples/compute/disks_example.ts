import * as compute from "@azure/arm-compute";
import { DefaultAzureCredential } from "@azure/identity";
import { ResourceManagementClient } from "@azure/arm-resources";

var subscriptionId = process.env.subscriptionId;
var credential = new DefaultAzureCredential();


class DisksExamples{
    private compute_client = new compute.ComputeManagementClient(credential, subscriptionId);
    private resource_client = new ResourceManagementClient(credential, subscriptionId);
    private resourceName = "myjstest";
    private disk_name = "disknamex"
    

    //resource_groups_createOrUpdate
    private resource_groups_createOrUpdate(){
        this.resource_client.resourceGroups.createOrUpdate(this.resourceName,{location:"eastus"})
    }


    //disks.createOrUpdate
    public async disks_createOrUpdate(){
        const parameter:compute.Disk ={
            location: "eastus",
            creationData: {
                createOption: "Empty"
            },
            diskSizeGB: 200
        };
        await this.compute_client.disks.beginCreateOrUpdateAndWait(this.resourceName,this.disk_name,parameter).then(
            response => {
                console.log(response)
            } 
        )
    }

    //disks.get
    public async disks_get(){
        await this.compute_client.disks.get(this.resourceName,this.disk_name).then(
            response => {
                console.log(response)
            } 
        )
    }

    //disks.listByResourceGroup
    public async disks_listByResourceGroup(){
        for await (let item of this.compute_client.disks.listByResourceGroup(this.resourceName)){
            console.log(item)
        }
    }

    //disks.list
    public async disks_list(){
        for await (let item of this.compute_client.disks.list()){
            console.log(item)
        }
    }

    //disks.update
    public async disks_update(){
        const parameter:compute.DiskUpdate= {
            diskSizeGB: 200
        };
        await this.compute_client.disks.beginUpdateAndWait(this.resourceName,this.disk_name,parameter).then(
            response => {
                console.log(response)
            } 
        )
    }

    //disks.grantAccess
    public async disks_grantAccess(){
        const parameter:compute.GrantAccessData ={
            access: "Read",
            durationInSeconds: 1800
        };
        await this.compute_client.disks.beginGrantAccessAndWait(this.resourceName,this.disk_name,parameter).then(
            response => {
                console.log(response)
            } 
        )
    }

    //disks.revokeAccess
    public async disks_revokeAccess(){
        await this.compute_client.disks.beginRevokeAccessAndWait(this.resourceName,this.disk_name).then(
            response => {
                console.log(response)
            }
        )
    }

    //disks.delete
    public async disks_delete(){
        await this.compute_client.disks.beginDeleteAndWait(this.resourceName,this.disk_name).then(
            response => {
                console.log(response)
            }
        )
    }

    //resource_groups_delete
    private resource_groups_delete(){
        this.resource_client.resourceGroups.beginDeleteAndWait(this.resourceName)
    }
}

class SnapshotsExamples{
    private compute_client = new compute.ComputeManagementClient(credential, subscriptionId);
    private disk_name = "disknamex";
    private resourceName = "myjstest";
    private shapshot_name = "snapshotx";
    private image_name = "imagex";

    //disks.createOrUpdate
    public async disks_createOrUpdate(){
        const parameter:compute.Disk = {
            location: "eastus",
            creationData: {
                createOption: "Empty"
            },
            diskSizeGB: 200
        };
        await this.compute_client.disks.beginCreateOrUpdateAndWait(this.resourceName,this.disk_name,parameter).then(
            response => [
                console.log(response)
            ]
        )
    }

    //snapshots.createOrUpdate
    public async snapshots_createOrUpdate(){
        const parameter:compute.Snapshot = {
            location: "eastus",
            creationData: {
                createOption: "Copy",
                sourceUri: "/subscriptions/" + subscriptionId + "/resourceGroups/" + this.resourceName + "/providers/Microsoft.Compute/disks/" + this.disk_name
            }
        };
        await this.compute_client.snapshots.beginCreateOrUpdateAndWait(this.resourceName,this.shapshot_name,parameter).then(
            response =>{
                console.log(response)
            }
        )
    }

    //snapshots.get
    public async snapshots_get(){
        await this.compute_client.snapshots.get(this.resourceName,this.shapshot_name).then(
            response => {
                console.log(response)
            }
        )
    }

    //snapshots.listByResourceGroup
    public async snapshots_listByResourceGroup(){
        for await (let item of this.compute_client.snapshots.listByResourceGroup(this.resourceName)){
            console.log(item)
        } 
    }

    //snapshots.list
    public async snapshots_list(){
        for await (let item of this.compute_client.snapshots.list()){
            console.log(item)
        } 
    }

    //snapshots.grantAccess
    public async snapshots_grantAccess(){
        const parameter:compute.GrantAccessData = {
            access: "Read",
            durationInSeconds: 1800
        };
        await this.compute_client.snapshots.beginGrantAccessAndWait(this.resourceName,this.shapshot_name,parameter).then(
            response => {
                console.log(response)
            }
        )
    }

    //snapshots.revokeAccess
    public async snapshots_revokeAccess(){
        await this.compute_client.snapshots.beginRevokeAccessAndWait(this.resourceName,this.shapshot_name).then(
            response => {
                console.log(response)
            }
        )
    }

    //snapshots.delete
    public async snapshots_delete(){
        await this.compute_client.snapshots.beginDeleteAndWait(this.resourceName,this.shapshot_name).then(
            response => {
                console.log(response)
            }
        )
    }

    //images.createOrUpdate
    public async images_createOrUpdate(){
        const parameter:compute.Image = {
            location: "eastus",
            storageProfile: {
                osDisk: {
                    osType: "Linux",
                    snapshot: {
                        id: "subscriptions/" + subscriptionId + "/resourceGroups/" + this.resourceName + "/providers/Microsoft.Compute/snapshots/" + this.shapshot_name
                    },
                    osState: "Generalized",
                },
                zoneResilient: false
            },
            hyperVGeneration: "V1"
        };
        await this.compute_client.images.beginCreateOrUpdateAndWait(this.resourceName,this.image_name,parameter).then(
            response =>{
                console.log(response)
            }
        )
    }

    //images.get
    public async images_get(){
        await this.compute_client.images.get(this.resourceName,this.image_name).then(
            response => {
                console.log(response)
            }
        ) 
    }

    //images.listByResourceGroup
    public async images_listByResourceGroup(){
        for await (let item of this.compute_client.images.listByResourceGroup(this.resourceName)){
            console.log(item)
        } 
    }

    //images.list
    public async images_list(){
        for await (let item of this.compute_client.images.list()){
            console.log(item)
        } 
    }

    //images.update
    public async images_update(){
        const parameter:compute.ImageUpdate = {
            tags: {
                ["department"]: "HR"
            }
        };
        await this.compute_client.images.beginUpdateAndWait(this.resourceName,this.image_name,parameter).then(
            response => {
                console.log(response)
            }
        )
    }

    //images.delete
    public async images_delete(){
        await this.compute_client.images.beginDeleteAndWait(this.resourceName,this.image_name).then(
            response => {
                console.log(response)
            }
        )
    }

}

