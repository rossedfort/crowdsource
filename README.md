# Crowdsource

[Production App](https://boiling-temple-53818.herokuapp.com/)

Crowdsource is a simple polling application. Using Express to build a server,
and Firebase plus Socket.io to transfer data, I've created an interface for users to
poll their friends. When a user creates a poll, they are considered the 'admin'.
Admins receive 2 links: One to send to all the voters, and one to see the results
of the poll in real time. Sessions ensure users can only vote once, and namespaced
URL's ensure only Admins can see the results. 
