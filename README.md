DotsDaily — Project Overview
What is DotsDaily?

DotsDaily is a lightweight, long-term product that generates dynamic iOS wallpapers showing visual progress using dots.

The core idea is inspired by concepts like Life Calendar (e.g. thelifecalendar.com):
visualizing time, progress, or remaining days in a simple, emotionally impactful way.

Instead of being an app, DotsDaily works via a single PNG URL that users plug into Apple Shortcuts, allowing their wallpaper to update automatically every day.

No app install. Just a PNG URL → a wallpaper → updated daily.

Core Use Cases

DotsDaily supports multiple types of progress visualizations, including:

Life progress

Days lived vs days remaining (based on birth date & life expectancy)

Year progress

Dots representing each day of the current year

Goal-based progress

Custom start & end dates (e.g. 90-day challenge, project timeline)

Monthly / weekly views

Other daily wallpapers

Daily quotes

Mindset / motivation wallpapers

Minimal “focus” or “discipline” visuals
(already planned and partially prepared)

All wallpapers are generated dynamically and delivered as PNG images only.

How It Works (High Level)

The user configures a wallpaper (life, year, goal, colors, layout, etc.)

The system generates a short, permanent URL:

https://dotsdaily.app/w/{id}


This URL always returns a PNG image (never SVG).

The user inserts this URL into iOS Shortcuts.

An automation runs daily (typically after midnight).

iOS fetches the PNG again → the wallpaper updates automatically.

Key constraint:

The URL must always return a valid PNG, otherwise iOS Shortcuts fails.

Technical Principles

SVG is used internally only as a rendering engine.

The final output exposed to users is always a PNG.

No SVG is ever shown to the user, even in case of error.

Errors return a fallback PNG error image (never text, never SVG).

Images are cached intelligently (usually until the next local midnight).

Layouts respect iOS safe zones (clock, widgets, camera, flash, home indicator).

Platform Scope

Primary target: iOS (Apple Shortcuts)

Android is out of scope (for now, intentionally)

No native app planned

Product must remain:

simple

low-maintenance

cheap to run

stable for years

Monetization Strategy

Free core usage

One-time lifetime unlock (planned around €2.99–€5.00)

Paid features may include:

advanced layouts

additional wallpaper types

color themes

extra visualization modes

No subscriptions.
No recurring user management overhead.

The goal is not aggressive monetization, but long-tail passive revenue.

Growth & Distribution Strategy

DotsDaily is designed to grow organically over time.

Planned channels:

SEO (primary)

Long-form evergreen pages

Target searches like:

“life calendar wallpaper”

“daily wallpaper ios shortcuts”

“progress wallpaper iphone”

Goal: traffic that still exists years later

Social & Content (secondary)

X (Twitter) posts

Reddit tutorials & showcases

Short videos:

YouTube

TikTok

Instagram / Facebook Reels

Pinterest

Content types:

how-to guides

setup tutorials

minimalist motivational visuals

organic product demos

Long-Term Vision

DotsDaily is intentionally built to:

require almost no maintenance

run with a single domain

work even if untouched for years

keep generating small but steady revenue

support new wallpaper types over time without breaking existing URLs

Think:

“Build once, let it live.”

One-Sentence Pitch (useful for headers / SEO)

DotsDaily lets you turn time, goals, and life progress into a daily-updating iPhone wallpaper — powered by a simple PNG URL and Apple Shortcuts.