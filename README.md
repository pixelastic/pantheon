# Pathfinder Pantheon search

This is the source of the website hosted at
[https://gamemaster.pixelastic.com/pantheon/][1]

It is a searchable list of all the gods in the Pathfinder RPG, as documented on
the [wiki][2].

## Why this website?

As a Gamemaster and Player, I often have to create characters that worship
a specific deity, to give them more depth. The Pathfinder Pantheon is full of
very interesting and well documented deities, so I often use it as a source of
inspiration.

But with so many Deities, it's hard to find quickly what I'm looking for. So
I crawled data from the wiki, put it into Algolia, and build a website around
it.

## Development

The repo contains both the data, and the website. All the Algolia records are
stored in `./data`. The `./src` folder contains the website itself.

To update the data locally by recrawling the wiki, run `yarn run
data:generate`. To push local data to Algolia, run `yarn run data:index`. To run
the website locally, run `yarn run serve`.

[1]: https://gamemaster.pixelastic.com/pantheon/
[2]: https://pathfinderwiki.com/wiki/Pathfinder_Wiki
