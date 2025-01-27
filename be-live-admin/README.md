# Backend Live Admin 

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About the project</a>
    </li>
    <li>
      <a href="#setup">How to setup project</a>
    </li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## [About The Project](#about-the-project)
This is REST APIs Service which is backend serves for Live Admin site

### Features:
* Managing accounts for admins, streamers and users in a live streaming platform
* Managing account logs for admins, streamers, superAdmin and users
* Managing upcoming sessions, live sessions in a live streaming platform
* Managing videos in a live streaming platform
* Managing categories for live
* Visualizing overview statistics data, video statistics data, live statistics data, user statistics data

TechStack:
* Golang (v1.22.2)
* PostgresQL
* Docker




<!-- GETTING STARTED -->
## [How to setup project](#setup)

I. Instructions on setting up your project via docker compose

1. Install docker, docker compose
   
2. Create tmp folder like this
    ```plaintext
    be-live-admin/
    ├── tmp/
    │   ├── avatar/
    │   ├── logs/
    │   ├── recordings/
    |   |    └── live/
    |   ├──scheduled_videos/
    |   ├──thumbnail/
    |   └──videos/
    

    ```
3. Replace config.ini.docker to config.ini
      ```sh
   cd ./be-live-admin/conf && mv config.example.docker.ini config.ini
   ```
4. Run docker compose
      ```sh
   cd ./be-live-admin/project && docker compose up -d
   ```

5. get swagger docs
      ```sh
   http://$HOST:8686/swagger/index.html
   ```   


 II. Instructions on setting up your project normally

 1. Install golang v1.22.2
 2. Install PostgresQL server
   
 3. Create tmp folder like this
    ```plaintext
    be-live-admin/
    ├── tmp/
    │   ├── avatar/
    │   ├── logs/
    │   ├── recordings/
    |   |    └── live/
    |   ├──scheduled_videos/
    |   ├──thumbnail/
    |   └──videos/
    

    ```
4. Replace config.example.ini to config.ini
      ```sh
   cd ./be-live-admin/conf && mv config.example.ini config.ini
   ```

5. Run project
      ```sh
   go run ./be-live-admin/main.go
   ```

6. get swagger docs
      ```sh
   http://$HOST:8686/swagger/index.html
   ```   