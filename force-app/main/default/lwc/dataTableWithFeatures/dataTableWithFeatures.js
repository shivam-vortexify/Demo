import { LightningElement, track, wire } from 'lwc';
import accList from '@salesforce/apex/GetAllAccList.getAllAccounts';
import LocationMap from '@salesforce/apex/LocationMapping.LocationMapping';
import SearchLocation from '@salesforce/apex/FindLocation.FindLocation';
import EmailSend from '@salesforce/apex/contactEmail.contactEmail';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class DataTableWithFeatures extends LightningElement {
    @track mapMarkers = [];
    IsShowLocationModal = false;
    IsSearchModal = false;
    ShowUploadModal = false;
    ishowEmailModal = false;
    @track accounts;
    @track AccID;
    @track searchLocation;
    @track mapUrl='';
    @track recordId;
    @track subjectEmail;
    @track bodyEmail;
    @track newaccountId;
    // @track RecordRow;

    columns = [
        { label: 'Name', fieldName: 'Name' },
        { label: 'Phone', fieldName: 'Phone' },
        { label: 'Rating', fieldName: 'Rating' },
        { label: 'Industry', fieldName: 'Industry' },
        {
            label: 'Location',
            type: 'button',
            typeAttributes: {
                label: 'Map',
                name: 'Map',
                iconName: 'utility:location', // Add icon
                iconPosition: 'left' // Positioning the icon
            }
        },
        {
            label: 'Upload File',
            type: 'button',
            typeAttributes: {
                label: 'Upload File',
                name: 'uploadFile',
                iconName: 'utility:upload', // Add icon
                iconPosition: 'left' // Positioning the icon
            }
        },
        {
            label: 'Email',
            type: 'button',
            typeAttributes: {
                label: 'Send Email',
                name: 'SendEmail',
                iconName: 'utility:email', // Add icon
                iconPosition: 'left' // Positioning the icon
            }
        }
    ];

    @wire(accList)
    wiredAccounts({ error, data }) {
        if (data) {
            this.accounts = data;
        } else if (error) {
            console.error('Error fetching accounts:', error);
        }
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        if (actionName === 'Map') {
            this.viewMaps(row.Id);
            // this.AccID = row.Id;
            // console.log(this.AccID););
        }
        else if(actionName==='uploadFile'){
            this.ShowUploadModal = true;
            this.recordId=event.detail.row.Id;   
         }
         else if(actionName==='SendEmail'){
            this.ishowEmailModal=true;
        }
    }

    viewMaps(AccID) {
        LocationMap({ AccID })
        .then(data => {
          if (data) {
              this.mapMarkers = [
                  {
                      location: {
                          City: data.BillingCity,
                          State: data.BillingState,
                          Country: data.BillingCountry,
                          PostalCode: data.BillingPostalCode,
                          Street: data.BillingStreet
                      },
                      title: data.Name,
                      description: `Location of ${data.Name}`
                  }
              ];
              console.log('Map Markers:', JSON.stringify(this.mapMarkers)); 
              this.IsShowLocationModal = true;
          }
        })
        .catch(error => {
            console.error('Error fetching account location:', error);
         });
    }

    handleCancelMap() {
        this.IsShowLocationModal = false;
    }

    OpenSearchModal(){
         this.IsSearchModal = true;
    }

    handleCancelSearch() {
        this.IsSearchModal = false;
    }

    handleCancelupload(){
        this.ShowUploadModal = false;
    }

    handleCancelEmail(){
        this.ishowEmailModal=false;
    }

        acceptedFormats(){
        return ['.pdf', '.jpg', '.png'];
        }
     
        handleUploadFinish(event){
     
            const files = event.detail.files;
            alert('No. of files uploaded:' + files.length);
        }


handleFindMyLocation(event){
    this.searchLocation=event.target.value;
}
handelFind(){
    SearchLocation({Search:this.searchLocation}).then(result => {
        this.mapUrl = result;
        console.log(this.mapUrl);
    })
    .catch(error => {
        this.error = error;
    })
    }

    handleChangeOnSubject(event){
      this.subjectEmail=event.target.value;
    }
    handelChangeDescription(event){
      this.bodyEmail=event.target.value;
    }
     
    handelRowEmailRecord(){
        const conId = event.detail.recordId;
        this.contactId = conId;
    }
    handleSend() {
        EmailSend({ contactId: this.contactId, subject: this.subjectEmail, body: this.bodyEmail })
            .then(() => {
     
                this.showToast('Success', 'Email sent successfully', 'success');
                this.ishowEmailModal=false;
            })
            .catch(error => {
     
                this.showToast('Error', 'Failed to send email', 'error');
                console.error(error);
            });
    }

    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(evt);
    }   
}
