import bcrypt from "bcrypt";

const test = async () => {
    const hash = await bcrypt.hash("hello123", 10);
    console.log(hash);
};

test();