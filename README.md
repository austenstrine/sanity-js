# sanity-js
Work in progress. Suite of helpers and sanity tools for working with javascript that don't depend on jQuery. Part of a passion project - rebuilding the internet one piece at a time, so that conservatives (and more especially, Christians), have palatable tech options. Specifically built in response to jQuery's open and intrusive support of BLM - sane people need alternatives.

Modifies javascript prototypes directly, because we all know that javascript just needs to be better out of the box.

Don't use the node hide/show functions yet, they need to be re-designed. Feel free to improve them and do a PR though.

`ael()` does not properly set `this` yet - was written before I knew how to do it. This will be rectified in the future, but for now, use the 2nd parameter - it's the element that matches the selector.

I don't test on or support internet explorer. Sorry.
