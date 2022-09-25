import joi from 'joi';
import { ObjectId } from 'mongodb';
import { db } from '../database/db.js'
import dayjs from 'dayjs';

const choiceSchema = joi.object({
    title: joi.string().empty(' ').required(),
    pollId: joi.string().empty(' ').required()
})

const repeat = async (title) => {
    const findtitle = await db.collection('choice').findOne({ title })
    return findtitle
}

async function choicePost(req, res) {
    const { title, pollId } = req.body
    const research = await db.collection('poll').findOne({ _id: ObjectId(pollId) })

    try {

        if (research.expireAt <= dayjs().format('YYYY-MM-DD HH:mm')) {
            res.sendStatus(403)
            return
        }

        const validation = choiceSchema.validate(req.body, { abortEarly: false })

        if (validation.error) {
            const erros = validation.error.details.map(detail => detail.message);
            res.status(422).send(erros);
            return
        }

        if (!research) {
            res.status(404).send('Poll not find')
            return
        }

        if (await repeat(title)) {
            res.sendStatus(409)
            return
        }

        const response = await db.collection('choice').insertOne(
            {
                title,
                pollId: ObjectId(pollId)
            }
        );



        res.status(201).send(`Voto criado com sucesso`);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

async function choicevotePost(req, res) {

    const { id } = req.params

    try {
        const research = await db.collection('choice').findOne({ _id: new ObjectId(id) })
        const findId = await db.collection('choice').find().toArray()
        console.log(research) //_id que será utilizado para por o voto e não o pollid

        if (!research) {
            res.status(404).send('Option not find')
            return
        }

        const confirmPoll = await db.collection('poll').findOne({ _id: new ObjectId(research.pollId) })

        if (confirmPoll.expireAt <= dayjs().format('YYYY-MM-DD HH:mm')) {
            res.sendStatus(403)
            return
        }

        await db.collection('votes').insertOne({
            createdAt: dayjs().format("YYYY-MM-DD HH:mm"),
            choiceId: ObjectId(id)
        });

        res.sendStatus(201)

    } catch (error) {
        res.status(500).send(error.message);
    }
}

export { choicePost, choicevotePost };