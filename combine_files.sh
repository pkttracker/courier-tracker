#!/bin/bash

# Get the current directory name
dir_name=$(basename "$PWD")

# Output file named after the directory
output_file="${dir_name}.txt"

# Create or empty the output file
> "$output_file"

# Function to check if a file is text-based
is_text_file() {
    case "$1" in
        *.py|*.txt|*.html|*.json|*.sh|*.md|*.css|*.js|*.csv|*.xml)
            return 0
            ;;
        *)
            return 1
            ;;
    esac
}

# Recursively find all files, excluding the output file
find . -type f ! -name "$output_file" | while read -r file; do
    relative_path="${file#./}"
    echo "$relative_path" >> "$output_file"

    if is_text_file "$file"; then
        cat "$file" >> "$output_file"
    else
        echo "[Binary or non-text file content not included]" >> "$output_file"
    fi

    echo -e "\n" >> "$output_file"
done

echo "✅ Created $output_file with contents of all text-based files and placeholders for binary files."
