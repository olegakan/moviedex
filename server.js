require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require ('cors');
const movies = require('./movies.json');


const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

app.use((req,res,next)=>{
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization')

  if (!authToken || authToken.split(' ')[1] !== apiToken){
    return res.status(401).json({error: 'Unauthorized request'})
  }
  next()
})

function handleGetMovie(req,res) {
  const { genre, country, avg_vote } = req.query;
  let response = movies;

  if (genre) {
    response = response.filter(movie => 
      movie.genre.toLowerCase().includes(genre.toLowerCase())  
    )
  }

  if (country) {
    response = response.filter(movie =>
      movie.country.toLowerCase().includes(country.toLowerCase())
    )
  }

  if (avg_vote) {
    response = response.filter(movie =>
      Number(movie.avg_vote) >= Number(avg_vote)
    )
  }

  res.json(response)
}

app.get('/movie', handleGetMovie)

app.listen(8000, ()=>{  
  console.log('Server started on port 8000');  
})
