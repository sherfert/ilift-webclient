## iLift

When going to the gym, one often faces problems like keeping count of repetitions and tracking the equipment and weight used each time. Another problem is keeping track of your overall progress and using this information to improve and make training plans.

Our idea is approaching this by developing an application that integrates into the workout with minimal user interaction. The general flow of events would be a user picking up a piece of equipment (e.g. a dumbbell 10 kg), choosing the exercise he/she wants to do (e.g. biceps curl) on a touch screen, performing the exercise, and putting the equipment back. The system should detect and count the repetitions and save the information in an online service, that can be accessed later with a website.

To achieve this, we want to use the .NET Gadgeteer and attach it as a kind of "bracelet" to the user. The display should be fixed on the forearm and there should be an RFID reader in a glove. The equipment pieces need RFID tags with associated information about type, weight, and available exercises. The bracelet needs to include a gyroscope and accelerometer to recognize repetitions with different patterns based on the exercise performed by the user. The Gadgeteer will communicate with a web service that persists the collected information. This information can be later accessed with a web application. The technology used for this is a Java EE application with RESTful services.

Hardware needed:
- 2 Gadgeteers Starter kits with additional WiFi, gyroscope, accelerometer, and RFID reader each.
- 5 RFID tags
- 2 dumbbells with different weight
- 
### Installation

The projects need to be cloned:
-  [Webservices](https://github.com/sherfert/ilift-webservices)
-  [Websclient](https://github.com/sherfert/ilift-webclient)
-  [Gadgeteer](https://github.com/sherfert/ilift-gadgeteer)

1. Starting the REST Service
	
	1.1 Go to the /ilift-webservices directory, where you can find an eclipse projcet, and execute the following command:

		mvn clean compile assembly:single

	1.2 Afterwards you can start the services with the following command:

		java -jar target/ilift-webservices-0.0.1-SNAPSHOT-jar-with-dependencies.jar


2. Web Client Configuration

	Before trying to access the data from the web after you have started successfully the web services
	make sure you perform this step:

	2.1 Update the IP address in ```/ilift-webclient/config.js``` accordingly with the IP address where your web service is listening. 

	2.2 Open ```ilift.html``` file.

3. .NET Gadgeeter 

	3.1 You can find the .NET Gadgeteer solution inside the /ilift-gadgeteer folder. 

	3.2 The only thing that needs to be configured are the network parameters that you can find 
	in the NetworkClient class in the Network package and then you can deploy the application

	3.3 Finally you can deploy it in the Gadgeteer hardware.
