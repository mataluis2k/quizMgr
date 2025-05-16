CREATE TABLE `quizzes` (
  `quiz_id` int NOT NULL AUTO_INCREMENT,
  `quiz_name` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  `styling` json NOT NULL DEFAULT (json_object()),
  `questions` json NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `description` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`quiz_id`),
  KEY `idx_quiz_id` (`quiz_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


// apiConfig.json
{
  "routeType": "database",
  "dbType": "mysql",
  "dbConnection": "MYSQL_1",
  "dbTable": "quizzes",
  "route": "/api/quiz_render",
  "keys": ["quiz_id"],
    "uuidMapping": [
      "quiz_id"
    ],
  "allowRead": [
    "quiz_id",
    "quiz_name",
    "styling",
    "questions",
    "description",
    "created_at",
    "updated_at"
  ],
  "allowedMethods": ["GET"]
  
},{
  "routeType": "database",
  "dbType": "mysql",
  "dbConnection": "MYSQL_1",
  "dbTable": "quizzes",
  "route": "/api/quizzes",
  "keys": ["quiz_id"],
    "uuidMapping": [
      "quiz_id"
    ],
  "allowRead": [
    "quiz_id",
    "quiz_name",
    "styling",
    "questions",
    "description",
    "created_at",
    "updated_at"
  ],
  "allowWrite": [
    "quiz_name",
    "description",
    "styling",
    "questions",
    "created_at",
    "updated_at"
  ],
  "allowedMethods": ["GET", "POST", "PUT"],
  "columnDefinitions": {
    "quiz_id": "String",
    "quiz_name": "String",
    "styling": "Json",
    "questions": "Json",
    "created_at": "String",
    "updated_at": "String"
  },
  "auth": "token",
  "acl": ["publicAccess"]
}