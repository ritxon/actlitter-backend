const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const express = require("express");
const app = express();
const cors = require('cors');

app.use(cors());

app.get("/questions", (req, res) => {
	admin
		.firestore()
		.collection("questions")
        .orderBy('id', 'asc')
		.get()
		.then((data) => {
			let questions = [];
			data.forEach((doc) => {
				questions.push({
					questionId: doc.id,
					...doc.data(),
				});
			});
			return res.json(questions);
		})
		.catch((error) => console.error(err));
});

app.post("/question", (req, res) => {
	const newQuestion = {
		id: req.body.id,
		questionImage: req.body.questionImage,
		questionText: req.body.questionText,
        typeofAnswer: req.body.typeofAnswer,
        answerOptions: req.body.answerOptions,
		negativeFeedBack: req.body.negativeFeedBack,
		positiveFeedBack: req.body.positiveFeedBack,
	};

	admin
		.firestore()
		.collection("questions")
		.add(newQuestion)
		.then((doc) => {
			res.json({ message: `question ${doc.id} created successfully` });
		})
		.catch((err) => {
			res.status(500).json({ error: "something went wrong" });
			console.error(err);
		});
});

exports.api = functions.https.onRequest(app);
