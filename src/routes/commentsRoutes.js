import {Router} from "express";

const router = Router();

router.get("/dede", (req, res) => {
    res.json({message: "Users list"});
});

router.post("/test", (req, res) => {
    res.json({message: "User created"});
});

export default router;
