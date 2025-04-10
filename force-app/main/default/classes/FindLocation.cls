public with sharing class FindLocation {
    @AuraEnabled
    public static String FindLocation(String Search) {
        String api ='AIzaSyAX8LuxyYKwwd4Yr45xfzYE_3WjnkclZUE';
        String baseUrl = 'https://www.google.com/maps/embed/v1/place?key=' + api + '&q=' + EncodingUtil.urlEncode(Search, 'UTF-8');
        return baseUrl;
    }
}