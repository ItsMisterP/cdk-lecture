import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const isLocal = process.env.IS_OFFLINE;

const app = express();
const s3Config = isLocal ? {
    s3ForcePathStyle: true,
    accessKeyId: 'S3RVER', // Dummy-Zugangsdaten für lokale Tests
    secretAccessKey: 'S3RVER',
    endpoint: 'http://localhost:4569'
  } : {
    s3ForcePathStyle: true, 
    endpoint: 'http://s3.localhost.localstack.cloud:4566',};

const s3 = new S3(s3Config);
const BUCKET_NAME = process.env.BUCKET_NAME ?? ''; // Ersetze durch deinen tatsächlichen Bucket-Namen

app.use(cors());
app.use(express.json());

app.post('/todos', async (req, res) => {
  try {
    const todo = {
      id: uuidv4(),
      text: req.body.text,
      completed: false,
    };

    const params = {
      Bucket: BUCKET_NAME,
      Key: `todos/${todo.id}.json`, // Speicherort und Dateiname im Bucket
      Body: JSON.stringify(todo),
      ContentType: 'application/json',
    };

    await s3.putObject(params).promise();
    res.status(201).json({ message: 'To-Do gespeichert', todo });
  } catch (error) {
    console.error('Fehler beim Speichern des To-Dos:', error);
    res.status(500).json({ message: 'Fehler beim Speichern des To-Dos' });
  }
});

// Route zum Abrufen aller To-Dos
app.get('/todos', async (req, res) => {
    try {
      const listParams = {
        Bucket: BUCKET_NAME,
        Prefix: 'todos/',
      };
  
      const data = await s3.listObjectsV2(listParams).promise();
      const todoKeys = data.Contents?.map(item => item.Key) || [];
  
      const todos = await Promise.all(
        todoKeys.map(async key => {
          const getObjectParams = {
            Bucket: BUCKET_NAME,
            Key: key!,
          };
          const objectData = await s3.getObject(getObjectParams).promise();
          return JSON.parse(objectData.Body!.toString());
        })
      );
  
      res.status(200).json(todos);
    } catch (error) {
      console.error('Fehler beim Abrufen der To-Dos:', error);
      res.status(500).json({ message: 'Fehler beim Abrufen der To-Dos' });
    }
  });

  // Route zum Löschen eines To-Dos
app.delete('/todos/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const deleteParams = {
        Bucket: BUCKET_NAME,
        Key: `todos/${id}.json`,
      };
  
      await s3.deleteObject(deleteParams).promise();
      res.status(204).send(); // Erfolgreich gelöscht, keine Inhalte zurückgeben
    } catch (error) {
      console.error('Fehler beim Löschen des To-Dos:', error);
      res.status(500).json({ message: 'Fehler beim Löschen des To-Dos' });
    }
  });

export const handler = serverless(app);
