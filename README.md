<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://alephzero.org/">
    <img src="images/logo.png" alt="Logo" width="90" height="80">
  </a>

  <h3 align="center">Aleph-foresight-sync</h3>

  <p align="center">
     The Aleph Foresight Sync Service is designed to interact directly with blockchain, fetching blocks and capturing the latest changes in real-time. This service saves these updates to a database, allowing the backend to access the most recent blockchain data efficiently and quickly.
    <br />
    <a href="https://alephzero.org/"><strong>Aleph Foresight »</strong></a>
    <br />
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#license">License</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

<img width="1436" alt="Aleph home page" src="images/home.png">


The Aleph Foresight Sync Service continuously fetches the latest blocks from the blockchain, processes them to extract and format essential data, and then saves this information in a database. This approach ensures that backend services have quick and efficient access to the most current blockchain data performing the following functions:


1. **Fetching Blocks:** Continuously retrieving blocks from the blockchain, ensuring that the latest data is always available.

2. **Reading Blocks:**  Processing the fetched blocks, extracting relevant information, and transforming it into a format suitable for backend services.
3. 
4. **Saving to DB:** Storing the processed data in a database, providing a centralized and easily accessible repository for backend services to retrieve the information they need.


### Built With

* [![NodeJS][NodeJS]][Node-url]
* [![ExpressJs][ExpressJS]][Express-url]
* [![MongoDB][MongoDB]][MongoDB-url]
* [![Typescript][Typescript]][Typescript-url]
* [![Docker][Docker]][Docker-url]
* [![Apache Kafka][Apache Kafka]][Kafka-url]

<!-- GETTING STARTED -->
## Getting Started

To set up the project follow the instructions:

### Prerequisites

* NodeJS - [Installation Guide](https://nodejs.org/en/download/package-manager)
* Docker - [Installation Guide](https://docs.docker.com/get-docker/)

### Installation


1. Enter the env in `src/config/local.env`
   ```sh
    PORT=XXXX
    WEB_HOST=XXXXXXXXX
    BACKEND_API_HOST=XXXXXXXX
    SOCKET_HOST = XXXXXXX 
    MAXBLOCKSIZE=XXXXXX
    IPFSURL=XXXXXXXXX
    KAFKA_URL=XXXXXX
    MONGO_URI=XXXXXXXXXXX
    DBNAME=XXXXX
    COIN_MARKET_CAP_KEY=XXXXXXXX
    COIN_MARKET_CAP_URL=XXXXXXXXXXXX
    CONTRACT_ADDRESS=XXXXXXXXXXXX
    ADMIN=XXXXXXXXXX
    ```
2. Run docker file
   ```sh
   docker build .
   ```   
3. Create docker containers from docker compose file
   ```sh
   docker compose up -d
   ```  
4. Install dependencies
   ```sh
   npm install
   ```   
5. Run the app in development mode
   ```sh
   npm run dev
   ```  

<!-- LICENSE -->
## License

Distributed under the Apache License. See `LICENSE.txt` for more information.


<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [Typescript](https://www.typescriptlang.org/)
* [Web3](https://web3js.readthedocs.io/en/v1.10.0/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->

[NodeJS]: https://img.shields.io/badge/nodejs-green?style=for-the-badge&logo=nodedotjs&logoColor=white
[Node-url]: https://nodejs.org/en/docs
[ExpressJS]: https://img.shields.io/badge/expressjs-grey?style=for-the-badge&logo=expressdotjs&logoColor=white
[Express-url]: https://expressjs.com/
[MongoDB]: https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white
[MongoDB-url]:https://www.mongodb.com/docs/
[Typescript]: https://img.shields.io/badge/typescript-blue?style=for-the-badge&logo=typescript&logoColor=white
[Typescript-url]: https://www.typescriptlang.org/
[Docker]:https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white
[Docker-url]:https://docs.docker.com/
[Apache Kafka]:https://img.shields.io/badge/Apache%20Kafka-000?style=for-the-badge&logo=apachekafka
[Kafka-url]:https://kafka.apache.org/documentation/

