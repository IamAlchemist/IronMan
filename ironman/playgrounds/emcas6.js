/**
 * Created by wizard on 11/2/16.
 */
const hello = "world";
const obj = {hello};

for (let key of Object.keys(obj)) {
    console.log(key);
    console.log(obj[key]);
}
