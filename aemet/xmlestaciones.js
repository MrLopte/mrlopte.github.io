
var xmlDoc = document.implementation.createDocument(null, "devices");
var elements = xmlDoc.getElementsByTagName("devices");

var node = xmlDoc.createElement("DeviceA"); // do not use the methods provided by the document namespace 
node.setAttribute('ID', 1000);
node.setAttribute('DESCRIPTION', 'NameA');
elements[0].appendChild(node); // add the element

var node = xmlDoc.createElement("DeviceB");  
node.setAttribute('ID', 2000);
node.setAttribute('DESCRIPTION', 'NameB');
elements[0].appendChild(node); // add the element

var serializer = new XMLSerializer();
var xmlString = serializer.serializeToString(xmlDoc);

console.log('xmlString :\n' + xmlString);