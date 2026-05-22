# ---------------------------------------------------------------------------
# Gemfile for The Ridge-Heath HOA Jekyll site.
#
# GitHub Pages builds this site automatically on its servers, so this Gemfile
# is provided only so a maintainer can OPTIONALLY preview the site locally:
#
#   bundle install
#   bundle exec jekyll serve
#
# The `github-pages` gem pins Jekyll and all plugins to the exact versions
# GitHub Pages runs, so a local preview matches the live build.
# ---------------------------------------------------------------------------

source "https://rubygems.org"

gem "github-pages", group: :jekyll_plugins

# Windows and JRuby do not include zoneinfo files; bundle the tzinfo data.
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end
