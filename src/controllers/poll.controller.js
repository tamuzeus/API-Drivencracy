
import joi from 'joi';
import DateExtension from "@joi/date"
import JoiImport from 'joi';
import { db } from '../database/db.js'
import dayjs from 'dayjs';
import { ObjectId } from 'mongodb';

const Joi = JoiImport.extend(DateExtension)

const pollSchema = joi.object({
    title: joi.string().empty(' ').required(),
    expireAt: Joi.date().min('now').format('YYYY-MM-DD HH:mm')
})

const newexpireAt = dayjs(dayjs().add(30, 'day')).format('YYYY-MM-DD HH:mm')

async function pollPost(req, res) {
    let { title, expireAt } = req.body

    try {

        const validation = pollSchema.validate(req.body, { abortEarly: false })

        if (validation.error) {
            const erros = validation.error.details.map(detail => detail.message);

            res.status(422).send(erros);
            return
        }

        if (expireAt === null || expireAt === " " || !expireAt) {
            const response = await db.collection('poll').insertOne(
                {
                    title,
                    expireAt: newexpireAt
                }
            )
        } else {
            const response = await db.collection('poll').insertOne(
                {
                    title,
                    expireAt
                }
            )
        }

        res.sendStatus(201);

    } catch (error) {
        res.status(500).send(error.message);
    }
}

async function pollGet(req, res) {
    try {
        const data = await db
            .collection('poll')
            .find().toArray();

        res.send(data)
    } catch (error) {
        res.sendStatus(500);
    }
}

async function pollGetChoice(req, res) {
    const { id } = req.params

    try {
        const research = await db.collection('poll').findOne({ _id: new ObjectId(id) })

        if (!research) {
            res.status(404).send('Poll not find')
            return
        }
        const response = await db.collection('choice').find({ pollId: id }).toArray()
        res.send(response)

    } catch (error) {
        res.sendStatus(500);
    }
}

async function pollResults(req, res) {
    const { id } = req.params

    try {
        const poll = await db.collection('poll').findOne({ _id: ObjectId(id) })
        const choice = await db.collection('choice').find({ pollId: ObjectId(id) }).toArray()

        let indexmostVotes = 0
        let mostVotes = 0
        const votes = await Promise.all (choice.map(async element => {
            const elemvotes = await db.collection('votes').find({ choiceId: element._id }).toArray()
            return {
                title: element.title,
                votes: elemvotes.length
            }
        }));
        console.log(votes)

        votes.forEach((element, index) => {
            if (element.votes > mostVotes) {
                mostVotes = element.votes
                indexmostVotes = index
            }
        });

        res.send({ ...poll, result: votes[indexmostVotes] })

    } catch (error) {
        res.sendStatus(500);
        console.log(error)
    }
}

export { pollPost, pollGet, pollGetChoice, pollResults };