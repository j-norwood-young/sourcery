# Sourcery

Helping journalists interview digital assets

This is version 0.0.1 Alpha. IT IS NOT PRODUCTION-READY. Download it if you're happy with compiling it all yourself, and possibly want to make a contribution.

## About

Sourcery examines digital files for metadata. It is designed to make a journalist's job of examining files for authenticity a bit easier. We can't do a journalist's job for them, but at least we can give them all the metadata, easily, in one place. 

This is not designed to be a forensic tool.

It's important to understand what the metadata means, and to understand ways in which it is intentionally and unintentionally manipulated. We will include documentation on this in future releases.

## Format-specific information

It covers a variety of file formats. Currently, it will find date and size information on any file. 

- Exif data for images;
- Metadata from PDF;
- XMP data from PDF;

## Platforms

Sourcery is built on Electron, which means it will compile for Mac OSX, Linux, and Windows. It's currently only been tested on OSX.

## Roadmap

It's very early days for this project, so the roadmap is pretty fluid.

1. Support lots and lots of file types
  - PDF
  - Microsoft Doc and DocX
  - Other Microsoft Office formats
  - ODF formats
  - Video formats
  - Audio formats
  - Compressed files (zip, tar etc)

2. Filtering, sorting

3. Privacy
  - Have a privacy mode that doesn't upload any data to the interwebs

4. Source discovery
  - Finding original images
  - Finding original video
  - Find metadata on those originals


If you want other stuff, let me know.

jason@code4sa.org