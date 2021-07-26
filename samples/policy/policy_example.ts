import { PolicyClient,PolicyDefinition,PolicySetDefinition } from "@azure/arm-policy";
import { ResourceManagementClient } from "@azure/arm-resources";
import { ManagementGroupsAPI } from "azure-arm-managementgroups";
import { DefaultAzureCredential } from "@azure/identity";

const subscriptionId = process.env.subscriptionId;
const credential = new DefaultAzureCredential();

class PolicyDefinitionAtManagementGroupExamples {

    private policyclient = new PolicyClient(credential,subscriptionId);
    private managementclient = new ManagementGroupsAPI(credential);
    private resourceGroupName = "myjstest";
    private policyName = "jspolicy";
    private policyAssignmentName = "passigment";
    private policySetName = "jspolicy";
    private groupId = "20000000-0001-0000-0000-000000000123";

    //managementGroups.createOrUpdate 
    public async managementGroups_createOrUpdate(){
        const result = await this.managementclient.managementGroups.beginCreateOrUpdateAndWait(this.groupId,{name: this.groupId});
        console.log(result);
    }

    //policyDefinitions.createOrUpdateAtManagementGroup
    public async policyDefinitions_createOrUpdateAtManagementGroup(){
        const parameter:PolicyDefinition = {
            policyType: "Custom",
            description: "Don\'t create a VM anywhere",
            policyRule: {
                if: {
                    allof: [
                        {
                            source: "action",
                            equals: "Microsoft.Compute/virtualMachines/write"
                        },
                        {
                            field: "location",
                            in: [
                                "eastus",
                                "eastus2",
                                "centralus"
                            ]
                        }
                    ]
                },
                then: {
                    effect: "deny"
                }
            }
        };
        const definition = await this.policyclient.policyDefinitions.createOrUpdateAtManagementGroup(this.policyName,this.groupId,parameter);
        console.log(definition);
    }

    //policyDefinitions.getAtManagementGroup
    public async policyDefinitions_getAtManagementGroup(){
        const definition = await this.policyclient.policyDefinitions.getAtManagementGroup(this.policyName,this.groupId);
        console.log(definition);
        return definition;
    }

    //policyDefinitions.listByManagementGroup
    public async policyDefinitions_listByManagementGroup(){
        for await (let item of this.policyclient.policyDefinitions.listByManagementGroup(this.groupId)){
            console.log(item);
        }
    }

    //policyDefinitions.listBuiltIn
    public async policyDefinitions_listBuiltIn(){
        const arrayList = new Array();
        for await (let item of this.policyclient.policyDefinitions.listBuiltIn()){
            arrayList.push(item);
            console.log(item);
        }
        return arrayList;
    }

    //policyDefinitions.getBuiltIn
    public async policyDefinitions_getBuiltIn(){
        const arrayOne = await this.policyDefinitions_listBuiltIn();
        await this.policyclient.policyDefinitions.getBuiltIn(arrayOne[0].name).then(
            result => {
                console.log(result);
            }
        )
    }

    //policyDefinitions.list
    public async policyDefinitions_list(){
        for await (let item of this.policyclient.policyDefinitions.list()){
            console.log(item);
        }
    }

    //policyAssignments.listForManagementGroup
    public async policyAssignments_listForManagementGroup(){
        for await (let item of this.policyclient.policyAssignments.listForManagementGroup(this.groupId,{filter:"atScope()"})){
            console.log(item);
        }
    }

    //policyAssignments.create
    public async policyAssignments_create(){
        const scope = "/providers/Microsoft.Management/managementgroups/20000000-0001-0000-0000-000000000123/";
        const definition = await this.policyDefinitions_getAtManagementGroup();
        const assigment = await this.policyclient.policyAssignments.create(scope,this.policyAssignmentName,{policyDefinitionId: definition.id});
        console.log(assigment);
        return assigment;
    }

    //policyAssignments.get
    public async policyAssignments_get(){
        const assigment = await this.policyAssignments_create();
        await this.policyclient.policyAssignments.get(assigment.scope,assigment.name).then(
            result => {
                console.log(result);
            }
        )
    }

    //policyAssignments.list
    public async policyAssignments_list(){
        const arrayList = new Array();
        for await (let item of this.policyclient.policyAssignments.list()){
            arrayList.push(item);
            console.log(item)
        }
        console.assert(arrayList.length > 0);
    }

    //policyAssignments.listForResourceGroup
    public async policyAssignments_listForResourceGroup(){
        const arrayList = new Array();
        for await (let item of this.policyclient.policyAssignments.listForResourceGroup(this.resourceGroupName)){
            arrayList.push(item);
            console.log(item)
        }
        console.assert(arrayList.length >= 1);
    }

    //policyAssignments.listForResource
    public async policyAssignments_listForResource(){
        const arrayList = new Array();
        for await (let item of this.policyclient.policyAssignments.listForResource(this.resourceGroupName,"Microsoft.Compute","","availabilitySets","jstrack2test")){
            arrayList.push(item);
            console.log(item)
        }
        console.log(arrayList);
    }

    //policyAssignments.delete
    public async policyAssignments_delete(){
        const scope = "/providers/Microsoft.Management/managementgroups/20000000-0001-0000-0000-000000000123/";
        await this.policyclient.policyAssignments.delete(scope,this.policyAssignmentName).then(
            result => {
                console.log(result);
            }
        )
    }

    //policySetDefinitions.createOrUpdateAtManagementGroup
    public async policySetDefinitions_createOrUpdateAtManagementGroup(){
        const parameter:PolicySetDefinition = {  
            policyDefinitions: [
                {
                    policyDefinitionId: "/providers/Microsoft.Management/managementgroups/"+this.groupId+"/providers/Microsoft.Authorization/policyDefinitions/" + this.policyName,
                    policyDefinitionReferenceId: "Limit_Skus",   
                }
            ]  
        }
        await this.policyclient.policySetDefinitions.createOrUpdateAtManagementGroup(this.policySetName,this.groupId,parameter).then(
            result => {
                console.log(result);
            }
        )
    }

    //policySetDefinitions.getAtManagementGroup
    public async policySetDefinitions_getAtManagementGroup(){
        await this.policyclient.policySetDefinitions.getAtManagementGroup(this.policySetName,this.groupId).then(
            result => {
                console.log(result);
            }
        )
    }

    //policySetDefinitions.listByManagementGroup
    public async policySetDefinitions_listByManagementGroup(){
        const arrayList = new Array();
        for await (let item of this.policyclient.policySetDefinitions.listByManagementGroup(this.groupId)){
            arrayList.push(item);
            console.log(item);
        }
    }

    //policySetDefinitions.listBuiltIn
    public async policySetDefinitions_listBuiltIn(){
        const arrayList = new Array();
        for await (let item of this.policyclient.policySetDefinitions.listBuiltIn()){
            arrayList.push(item);
            console.log(item);
        }
        // console.assert()
        return arrayList;
    }

    //policySetDefinitions.list
    public async policySetDefinitions_list(){
        const arrayList = new Array();
        for await (let item of this.policyclient.policySetDefinitions.list()){
            arrayList.push(item);
            console.log(item);
        }
    }

    //policySetDefinitions.getBuiltIn
    public async policySetDefinitions_getBuiltIn(){
        const arrayList = await this.policySetDefinitions_listBuiltIn();
        await this.policyclient.policySetDefinitions.getBuiltIn(arrayList[0].name).then(
            result => {
                console.log(result);
            }
        )
    }

    //policySetDefinitions.deleteAtManagementGroup
    public async policySetDefinitions_deleteAtManagementGroup(){
        await this.policyclient.policySetDefinitions.deleteAtManagementGroup(this.policySetName,this.groupId).then(
            result => {
                console.log(result);
            }
        )
    }

    //policyDefinitions.deleteAtManagementGroup
    public async policyDefinitions_deleteAtManagementGroup(){
        await this.policyclient.policyDefinitions.deleteAtManagementGroup(this.policyName,this.groupId).then(
            result => {
                console.log(result);
            }
        )
    }

    //managementGroups.delete
    public async managementGroups_delete(){
        await this.managementclient.managementGroups.beginDeleteAndWait(this.groupId).then(
            result => {
                console.log(result)
            }
        )
    }
}

class PolicyDefinitionExamples {

    private policyclient = new PolicyClient(credential,subscriptionId);
    private managementclient = new ManagementGroupsAPI(credential);
    private resourceGroupName = "myjstest";
    private policyName = "jspolicy";
    private policyAssignmentName = "passigment";
    private policySetName = "jspolicy";
    private scope = "/subscriptions/" + subscriptionId + "/resourceGroups/" + this.resourceGroupName;
    private policyId = "/subscriptions/" + subscriptionId + "/resourceGroups/" + this.resourceGroupName + "/providers/Microsoft.Authorization/policyAssignments/" +this.policyAssignmentName;

    //policyDefinitions.createOrUpdate
    public async policyDefinitions_createOrUpdate(){
        const parameter:PolicyDefinition = {
            policyType: "Custom",
            description: "Don\'t create a VM anywhere",
            policyRule: {
                if: {
                    allof: [
                        {
                            source: "action",
                            equals: "Microsoft.Compute/virtualMachines/read"
                        },
                        {
                            field: "location",
                            in: [
                                "eastus",
                                "eastus2",
                                "centralus"
                            ]
                        }
                    ]
                },
                then: {
                    effect: "deny"
                }
            }
        };
        const definition = await this.policyclient.policyDefinitions.createOrUpdate(this.policyName,parameter);
        console.log(definition);
        return definition;
    }

    //policyDefinitions.get
    public async policyDefinitions_get(){
        const definition = await this.policyDefinitions_createOrUpdate();
        await this.policyclient.policyDefinitions.get(definition.name).then(
            result => {
                console.log(result);
            }
        )
    }

    //policyDefinitions.list
    public async policyDefinitions_list(){
        const arrayList = new Array();
        for await (let item of this.policyclient.policyDefinitions.list()){
            arrayList.push(item);
            console.log(item);
        }
        console.assert(arrayList.length > 0)
    }

    //policyAssignments.create
    public async policyAssignments_create(){
        const definition = await this.policyDefinitions_createOrUpdate();
        const assigment = await this.policyclient.policyAssignments.create(this.scope,this.policyAssignmentName,{policyDefinitionId:definition.id});
        console.log(assigment);
        return assigment;
    }

    //policySetDefinitions.createOrUpdate
    public async policySetDefinitions_createOrUpdate(){
        const definition = await this.policyDefinitions_createOrUpdate();
        const parameter: PolicySetDefinition = {
            displayName: "Cost Management",
            description: "Policies to enforce low cost storage SKUs",
            metadata: {
                category: "Cost Management"
            },
            policyDefinitions: [
                {
                    policyDefinitionId: definition.id,
                    parameters: {

                    }
                }
            ]
        };
        await this.policyclient.policySetDefinitions.createOrUpdate(this.policySetName,parameter).then(
            result => {
                console.log(result);
            }
        )
    }

    //policyAssignments.get
    public async policyAssignments_get(){
        const assigment = await this.policyAssignments_create();
        await this.policyclient.policyAssignments.get(assigment.scope,assigment.name).then(
            result => {
                console.log(result);
            }
        )
    }

    //policyAssignments.list
    public async policyAssignments_list(){
        const arrayList = new Array();
        for await (let item of this.policyclient.policyAssignments.list()){
            arrayList.push(item);
            console.log(item);
        }
        console.assert(arrayList.length > 0)
    }

    //policyAssignments.listForResourceGroup
    public async policyAssignments_listForResourceGroup(){
        const arrayList = new Array();
        for await (let item of this.policyclient.policyAssignments.listForResourceGroup(this.resourceGroupName)){
            arrayList.push(item);
            console.log(item);
        }
        console.assert(arrayList.length >= 1)
    }

    //policyAssignments.listForResource
    public async policyAssignments_listForResource(){
        const arrayList = new Array();
        for await (let item of this.policyclient.policyAssignments.listForResource(this.resourceGroupName,"Microsoft.Compute","","availabilitySets","jstrack2test")){
            arrayList.push(item);
            console.log(item);
        }
    }

    //policyAssignments.delete
    public async policyAssignments_delete(){
        await this.policyclient.policyAssignments.delete(this.scope,this.policyAssignmentName).then(
            result => {
                console.log(result);
            }
        )
    }

    //policyAssignments.createById
    public async policyAssignments_createById(){
        const definition = await this.policyDefinitions_createOrUpdate();
        const assigment = await this.policyclient.policyAssignments.createById(this.policyId,{policyDefinitionId:definition.id});
        console.log(assigment);
        return assigment;
    }

    //policySetDefinitions.get
    public async policySetDefinitions_get(){
        await this.policyclient.policySetDefinitions.get(this.policySetName).then(
            result => {
                console.log(result);
            }
        )
    }

    //policyAssignments.getById
    public async policyAssignments_getById(){
        const assigment = await this.policyAssignments_createById();
        await this.policyclient.policyAssignments.getById(assigment.id).then(
            result => {
                console.log(result);
            }
        )
    }

    //policyAssignments.deleteById
    public async policyAssignments_deleteById(){
        const assigment = await this.policyAssignments_createById();
        await this.policyclient.policyAssignments.deleteById(assigment.id).then(
            result => {
                console.log(result);
            }
        )
    }

    //policySetDefinitions.delete
    public async policySetDefinitions_delete(){
        await this.policyclient.policySetDefinitions.delete(this.policySetName).then(
            result => {
                console.log(result);
            }
        )
    }

    //policyDefinitions.delete
    public async policyDefinitions_delete(){
        const definition = await this.policyDefinitions_createOrUpdate();
        await this.policyclient.policyDefinitions.delete(definition.name).then(
            result => {
                console.log(result);
            }
        )
    }
}