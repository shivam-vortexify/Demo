public with sharing class contactEmail {
    @AuraEnabled
    public static void contactEmail(Id contactId, String subject, String body) {
        Contact contactRec = [SELECT Email FROM Contact WHERE Id = :contactId LIMIT 1];
 
        if (contactRec.Email != null) {
            sendEmail(contactRec.Email, subject, body);
        }
    }
 
    public static void sendEmail(String toAddress, String subject, String body) {
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();

        mail.setToAddresses(new List<String>{toAddress});
        mail.setSubject(subject);
        mail.setHtmlBody(body);
 
        Messaging.sendEmail(new List<Messaging.SingleEmailMessage>{mail});
    }
}