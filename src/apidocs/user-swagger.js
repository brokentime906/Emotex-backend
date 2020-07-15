/**
 * @swagger
 * definitions:
 *  User:
 *   type: object
 *   required:
 *     - email
 *     - password
 *     - name
 *     - age
 *     - gender
 *     - country
 *   properties:
 *     _id:
 *       type: string
 *       description: ObjectId
 *     email:
 *       type: string
 *       description: user email(google , youtube)
 *     password:
 *       type: string
 *       description: user password
 *     name:
 *       type: string
 *       description: user name
 *     age:
 *       type: integer
 *       description: user age
 *     country:
 *       type: integer
 *       description: user country
 *     email_verify:
 *       type: boolean
 *       description: 이메일 인증여부
 */

/**
 * @swagger
 *  /user/signup:
 *    get:
 *      summary: signup function implementation , save data to mongo db
 *      description: Youtube email login ==> get token
 *      tags:
 *      - User
 *      parameters:
 *        - name : email
 *          in    : body
 *          required: true
 *          schema :
 *            type: string
 *        - name : password
 *          in    : body
 *          required: true
 *          schema :
 *            type: string
 *        - name : name
 *          in    : body
 *          required: true
 *          schema :
 *            type: string
 *        - name : age
 *          in    : body
 *          required: true
 *          schema :
 *            type: Integer
 *        - name : gender
 *          in    : body
 *          required: true
 *          schema :
 *            type: string
 *        - name : country
 *          in    : body
 *          required: true
 *          schema :
 *            type: string
 *      responses:
 *       200:
 *        description: sign up success , send token
 *       300:
 *         description: sign up failure
 */
