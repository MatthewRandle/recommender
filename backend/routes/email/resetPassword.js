const pool = require("../../services/db");
const keys = require("../../../config/keys");
const moment = require("moment");
const v1 = require("uuid").v1;
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(keys.sendgridKey);

const checkIfUserAlreadyHasCode = `
    SELECT code, valid_until
    FROM verification
        JOIN verification_type ON verification_type.id = verification.verification_type_id
        JOIN user ON user.id = verification.user_id
    WHERE type = "password" AND user.email = ?
    ORDER BY valid_until DESC
    LIMIT 1;
`;

const insertCode = `
    INSERT INTO verification
    (code, valid_until, user_id, verification_type_id)
    VALUES(?, ?, (
        SELECT id
        FROM user
        WHERE email = ?
    ), (
        SELECT id
        FROM verification_type
        WHERE type = "password"
    ));
`;

const checkUserExists = `
    SELECT id
    FROM user
    WHERE email = ?;
`;

module.exports = (app) => {
    app.post("/email/reset-password", (req, res) => {
        if (req.body.email == null) return res.status(400).send({ code: "ERR_SEND_RESET_PASSWORD_EMAIL_NO_BODY" });        

        pool.query(checkUserExists, [req.body.email], async (err, results) => {
            if (err) return res.status(500).send({ code: "ERR_SEND_RESET_PASSWORD_EMAIL_CHECK_USER" });

            if(results.length === 0) return res.end();

            pool.query(checkIfUserAlreadyHasCode, [req.body.email], async (err, results) => {
                if (err) return res.status(500).send({ code: "ERR_SEND_RESET_PASSWORD_EMAIL_CHECK" });

                if (results.length > 0) {
                    const timestamp = results[0].valid_until;

                    //if the timestamp hasn't expired, send a new email
                    if (moment().isBefore(timestamp)) {
                        const existingCode = results[0].code;

                        const msg = {
                            subject: "Reset Your Password",
                            from: "account@recommender.com",
                            template_id: "d-6c5344d1dbfa4f57a0b61202d88a3470",
                            to: req.body.email,
                            dynamic_template_data: {
                                verifyLink: `${keys.link}/verification/password/${existingCode}`
                            }
                        };

                        try {
                            await sgMail.send(msg);
                            return res.end();
                        }
                        catch (err) {
                            return res.status(500).send({ code: "ERR_SEND_RESET_PASSWORD_EMAIL" });
                        }
                    }
                }

                const code = v1();

                pool.query(insertCode, [code, moment().add(1, "hour").format(), req.body.email], async (err) => {
                    if (err) return res.status(500).send({ code: "ERR_SEND_RESET_PASSWORD_NEW_CODE" });

                    const msg = {
                        subject: "Reset Your Commenze Password",
                        from: "account@commenze.com",
                        template_id: "d-6c5344d1dbfa4f57a0b61202d88a3470",
                        to: req.body.email,
                        dynamic_template_data: {
                            verifyLink: `${keys.link}/verification/password/${code}`
                        }
                    };

                    try {
                        await sgMail.send(msg);
                        return res.end();
                    }
                    catch (err) {
                        return res.status(500).send({ code: "ERR_SEND_RESET_PASSWORD_EMAIL_NEW" });
                    }
                });
            });
        });
    });
};