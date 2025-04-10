public with sharing class LocationMapping {
    @AuraEnabled(cacheable=true)
    public static Account LocationMapping(Id AccID) {	
        return  [SELECT Id, BillingStreet, BillingCity, BillingState, BillingPostalCode, BillingCountry FROM Account where id =:AccID LIMIT 1];
    }
}