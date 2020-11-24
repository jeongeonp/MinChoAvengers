# CS473 Introduction to Social Computing
Repository for Design Project of CS473, KAIST, 2020 Fall 

## About the Course
Human-computer interaction no longer only concerns a single user in front of their computer. An increasing number of modern systems are inherently social, involving a large group of users to collaborate, discuss, ideate, solve problems, and make decisions together via social interaction. This course focuses on crowdsourcing and social computing, two of the most important concepts in the era of interaction at scale. This course will cover major design issues and computational techniques in building crowdsourcing and social computing systems. [Course Website](https://www.kixlab.org/courses/cs473-fall-2020/index.html)

## About the Design Project
Following a [user-centered design process](https://www.kixlab.org/courses/cs473-fall-2020/design-project.html), the students form teams to build an interactive prototype through a semester-long team project.

### Our system - Minchoom
The system aims to support **late or distracted users** who are often **heavily penalized** due to the characteristics of real-time online lectures by helping them to easily catch up with the context.  
You can try our system [here](https://minchoom-cs473.web.app/).

### Contributors
* [Mina Huh](https://github.com/minarainbow)
* [Juhoon Lee](https://github.com/julielee16)
* [Jeongeon Park](https://github.com/jeongeonp)

### Design Project Milestones
* DP0: Team Formation
* DP1: Ideation [[Report](./documents/DP1/DP1-Ideation.md)]
* DP2: Pitch [[Slides](./documents/DP2/DP2-Project%20Pitch.pdf)]
* DP3: Low-fi Prototype [[Report](./documents/DP3/DP3-Low-fi.md)] [[Prototype](https://www.figma.com/proto/JHYZayKschscpM5sQty0GX/CS473-DP3-Low-fi?node-id=133%3A643&scaling=min-zoom)]
* DP4: High-fi Prototype
* DP5: Final Presentation
* DP6: Final Paper & Video

## About the Repository
### Structure
There are two main folders in this repository, **documents** and **minchoom**.  
The **documents** folder is where the reports and the presentation slides are, and the **minchoom** folder contains the code of the system.  

Inside the **minchoom** folder, the components are divided in the **src/components** directory.
* [Home.js](./minchoom/src/components/Home.js): Main JavaScript file where all the components are linked to
* [Chat.js](./minchoom/src/components/Chat.js): Chatroom of the system
* [Timeline.js](./minchoom/src/components/Timeline.js): The timeline of the real-time lecture with crowd-generated flags

### How to run?
You can see our system [here](https://minchoom-cs473.web.app/).  

For development,
```
cd minchoom
npm install
npm run start
```

For deployment,
```
cd minchoom
npm install
npm run build
```
