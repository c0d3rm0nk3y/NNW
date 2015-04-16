## flesh out the workflow just after obtaining (new or existing) searchID.

* after getting results from feed(), when cycling though the articles make sure to search into the text for hits on the keywords.
* add in functions for using text-miner to get statistical relevance from the article and use the top results to populate tags.
* when processing a feed's articles save every one, adding statistics on an article, entire feeds worth of articles and finally, all articles from all feeds in the query.
* need a function to handle pulling by date range.
* use node.api readline to create a command prompt loop for program.. example can be found here: http://goo.gl/XZ5EpP