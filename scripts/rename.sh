#!/usr/bin/env bash

# Find all .mdx files recursively and rename them to .md
find . -type f -name "*.mdx" | while read -r file; do
    # Get the new filename by replacing .mdx with .md
    newfile="${file%.mdx}.md"

    # Rename the file
    mv "$file" "$newfile"

    # Print what was done
    echo "Renamed: $file -> $newfile"
done

echo "All .mdx files have been renamed to .md"
