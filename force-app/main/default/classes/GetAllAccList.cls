public with sharing class GetAllAccList {
    @AuraEnabled(cacheable=true)
    public static list<Account> getAllAccounts(){
      return [SELECT Id, Name, Industry, Phone,Rating FROM Account LIMIT 50];
    }
}