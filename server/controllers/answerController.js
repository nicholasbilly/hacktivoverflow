const Answer = require('../models/answer')

class answerController {
    static find(req, res, next) {
        Answer.find().populate('userId').sort({createdAt: -1})
        .then(result => {
            res.status(200).json(result)
        })
        .catch(next)
    }

    static findOne(req, res, next) {
        let id = req.params.id
        Answer.find({questionId: id}).populate('userId').sort({createdAt: -1})
        .then(result => {
            res.status(200).json(result)
        })
        .catch(next)
    }

    static findbyId(req, res, next) {
        Answer.findById(req.params.id).populate('userId')
        .then(result => {
            res.status(200).json(result)
        })
        .catch(next)
    }

    static create(req, res, next) {
        let { id } = req.decode
        let questionId = req.params.id
        let {content} = req.body
        Answer.create({
            content,
            questionId,
            userId : id,
            upVote: [],
            downVote: []
        })
        .then(result => {
            res.status(201).json(result)
        })
        .catch(next)
    }

    static update(req, res, next) {
        let { id } = req.params
        let updatedData = {}
        req.body.content && (updatedData.content = req.body.content)
        Answer.findByIdAndUpdate(id, updatedData, {new: true, runValidators: true})
        .then(result => {
            res.status(200).json(result)
        })
        .catch(next)
    }

    static delete(req, res, next) {
        Answer.findByIdAndDelete(req.params.id)
        .then(result => {
            res.status(200).json({message: 'Answer deleted'})
        })
        .catch(next)
    }

    static upvote(req, res, next) {
        let { id } = req.params
        let userId = req.decode.id
        Answer.findById(id)
        .then(answer => {
            let check = true
            for(let i = 0; i < answer.upVote.length; i++) {
                if (answer.upVote[i] == userId) {
                    check = false
                    res.status(200).json({message: 'already upvote'})
                }
            }
            for (let j = 0; j < answer.downVote.length; j++) {
                if (answer.downVote[j] == userId) {
                    check = false
                    Answer.findByIdAndUpdate(id, {$pull: {downVote: userId}}, {new: true, runValidators: true})
                    .then(result => {
                        res.status(200).json({message: 'removed down vote'})
                    })
                    .catch(next)
                }
            }

            if(check) {
                Answer.findByIdAndUpdate(id, {$push: {upVote: userId}}, {new: true, runValidators: true})
                .then(result => {
                    res.status(200).json({message: 'add upvote'})
                })
                .catch(next)
            } 
        })
        .catch(next)
    }

    static downvote(req, res, next) {
        let { id } = req.params
        let userId = req.decode.id
        Answer.findById(id)
        .then(answer => {
            let check = true
            for(let i = 0; i < answer.downVote.length; i++) {
                if (answer.downVote[i] == userId) {
                    check = false
                    res.status(200).json({message: 'already downvote'})
                }
            }
            for (let j = 0; j < answer.upVote.length; j++) {
                if (answer.upVote[j] == userId) {
                    check = false
                    Answer.findByIdAndUpdate(id, {$pull: {upVote: userId}}, {new: true, runValidators: true})
                    .then(result => {
                        res.status(200).json({message: 'removed up vote'})
                    })
                    .catch(next)
                }
            }

            if(check) {
                Answer.findByIdAndUpdate(id, {$push: {downVote: userId}}, {new: true, runValidators: true})
                .then(result => {
                    res.status(200).json({message: 'add downvote'})
                })
                .catch(next)
            }
        })
        .catch(next)
    }
}

module.exports = answerController