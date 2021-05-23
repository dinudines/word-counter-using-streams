const es = require("event-stream");
const got = require("got");
const apiResponse = require("../helpers/apiResponse");
const { getCount, sortMapByValue, getFirstNItemsOfMap, getPreResultsAndAPICalls, formatOutputResponse } = require("../helpers/utility");

const DEFAULT_URL = "http://norvig.com/big.txt";

/**
 * get top 10 words based on count with Synonyms, Parts of Speech
 * 
 * @returns {Object}
 */

exports.getWordCount = function (req, res) {
    try {
        const wordsWithCounts = new Map();

        let { url } = req.body;
        url = url || DEFAULT_URL;

        got.stream(url)
           .pipe(es.split())
           .pipe(
                es.mapSync(line => {
                    const words = line.split(" ");
                    getCount(words, wordsWithCounts);
                  })
                  .on("error", (err) => {
                      return apiResponse.ErrorResponse(res, {statusCode: 500,message: "Error reading the file"});
                  })
                  .on("end", () => {
                      (async () => {

                        // sort the map object by descending order of occurences
                        const sortedMap = sortMapByValue(wordsWithCounts);

                        // get only top 10 items from the map object
                        const tenItems = getFirstNItemsOfMap(10, sortedMap);

                        // get pre-calculated result and api calls with respective word
                        const [preResults, apiCalls] = getPreResultsAndAPICalls(tenItems);
                        
                        // wait for the api responses
                        const apiResults = await Promise.all(apiCalls);

                        // format the output
                        const finalResults = formatOutputResponse(apiResults, preResults);

                        // The final result can be persisted using mongodb or any db
                        return apiResponse.successResponseWithData(res, "successfully read the file", {url, result: finalResults});
                      })();
                  })
            );
    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    }
}