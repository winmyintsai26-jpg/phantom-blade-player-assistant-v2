import test from "node:test";
import assert from "node:assert/strict";
import {playerIssueDraft,playerIssueUrl} from "../src/feedback.js";
test("help feedback includes guide URL, diagnosis, outcome and optional platform",()=>{
 const args={title:"How to Beat Jing Ye",slug:"jing-ye-dismounted",diagnosis:"I can get him off his horse, but I keep dying",outcome:"not-solved",description:"Shield reflects damage",platform:"PS5 / 1.0.1"};
 const draft=playerIssueDraft(args);
 assert.match(draft.body,/Guide URL: https:\/\/phantom-blade-player-assistant-v2/);
 assert.match(draft.body,/Selected troubleshooting problem: I can get him off his horse/);
 assert.match(draft.body,/Player result: This did not solve my problem/);
 assert.match(draft.body,/PS5 \/ 1.0.1/);
 assert.match(draft.body,/Shield reflects damage/);
 const url=new URL(playerIssueUrl(args));
 assert.equal(url.hostname,"github.com");
 assert.equal(url.searchParams.get("body"),draft.body);
});
test("anonymous and invalid outcomes never create a submitted issue",()=>{
 assert.throws(()=>playerIssueDraft({title:"Jing Ye",slug:"jing-ye-dismounted",outcome:"bogus"}));
 assert.match(playerIssueDraft({title:"Jing Ye",slug:"jing-ye-dismounted",outcome:"solved"}).body,/Not provided/);
});
