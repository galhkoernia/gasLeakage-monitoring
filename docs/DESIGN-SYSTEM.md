# GasMonitor Design System

> This document defines the visual and interaction language of GasMonitor.
>
> UI implementation must follow this document unless an explicit product/design decision supersedes it.

---

# 1. Design Identity

GasMonitor is a technical monitoring application for an ESP32-based gas detection system.

The visual identity is:

- Modern
- Industrial
- Technical
- Precise
- Calm
- Professional
- Restrained
- Data-oriented

The interface should feel like professional monitoring software rather than a generic SaaS dashboard.

The design must prioritize:

1. Information hierarchy
2. Readability
3. State recognition
4. Data visualization
5. Operational clarity
6. Consistency

Visual novelty is secondary.

---

# 2. Design Principles

## 2.1 Information First

Every visual element should help the user understand:

- system state
- sensor state
- measurement
- trend
- device status
- alarm state
- historical event

Decorative UI that provides no information should generally not be introduced.

## 2.2 Calm Interface

The interface should remain visually calm during normal operation.

Color intensity should increase only when the system state requires attention.

Normal operation should not look like an alarm.

## 2.3 Semantic Color

Colors communicate system meaning.

They are not decorative.

Primary semantic states:

```text
NORMAL
WARNING
DANGER
OFFLINE
```

## 2.4 Restrained Visual Language

Use:

- subtle borders
- moderate corner radius
- restrained shadows
- clear spacing
- neutral backgrounds
- strong typography hierarchy

Avoid visual effects that compete with telemetry.

---

# 3. Color System

## 3.1 Base Colors

Use a neutral light interface.

```text
Background
#F6F7F8

Surface
#FFFFFF

Surface Secondary
#F9FAFB

Border
#E5E7EB

Border Strong
#D1D5DB

Text Primary
#171A1D

Text Secondary
#4B5563

Text Muted
#6B7280

Text Disabled
#9CA3AF
```

Exact values may be adjusted slightly during implementation to preserve accessibility and visual consistency.

---

# 4. Semantic Colors

## 4.1 Normal

```text
Primary
Green

Meaning
System operating within normal threshold.
```

Use green for:

- normal status
- healthy device state
- successful connection
- recovery event

Do not flood the interface with green.

---

## 4.2 Warning

```text
Primary
Amber

Meaning
Sensor value has exceeded the warning threshold.
```

Use amber for:

- warning status
- warning event
- warning threshold
- relevant chart annotation

---

## 4.3 Danger

```text
Primary
Red

Meaning
Sensor value has exceeded the danger threshold.
```

Use red for:

- danger status
- critical alarm
- danger threshold
- critical event

Red should remain visually concentrated around the relevant information.

Do not turn the entire dashboard red.

---

## 4.4 Offline

```text
Primary
Neutral Gray

Meaning
No recent communication from the device.
```

Offline is a system state, not an alarm severity.

Never represent OFFLINE as NORMAL.

---

# 5. Color Usage Rules

Do not use semantic colors as general decorative colors.

Bad:

```text
Green dashboard background
Red entire page
Amber card background everywhere
```

Good:

```text
● NORMAL
● WARNING
● DANGER
● OFFLINE
```

with subtle supporting backgrounds/borders where appropriate.

Color must never be the only mechanism used to communicate state.

Always include textual state labels.

---

# 6. Typography

Primary font:

**Inter**

Fallback:

```text
system-ui
-apple-system
BlinkMacSystemFont
"Segoe UI"
sans-serif
```

Typography must be highly readable.

## Scale

```text
Page Title
28px
font-weight: 600

Section Title
18px
font-weight: 600

Card Title
14px
font-weight: 500–600

Primary Metric
30–38px
font-weight: 600

Body
14px
font-weight: 400

Small / Metadata
12px
font-weight: 400–500
```

Avoid:

- futuristic fonts
- display fonts
- excessive font weights
- excessive uppercase text

Uppercase should primarily be used for compact labels and metadata.

---

# 7. Spacing System

Use a consistent spacing scale based on multiples of 4px.

```text
4px
8px
12px
16px
20px
24px
32px
40px
48px
64px
```

Primary spacing conventions:

```text
Page padding:
24–32px

Card internal padding:
20–24px

Card-to-card gap:
16–20px

Section-to-section:
28–40px
```

Avoid arbitrary spacing values unless there is a clear layout reason.

---

# 8. Border Radius

Use restrained corner radius.

```text
Card:
10–12px

Button:
8px

Input:
8px

Small badge:
999px
```

Do not apply large rounded corners to every component.

The interface should retain a technical and structured appearance.

---

# 9. Borders

Borders are preferred over heavy shadows.

Default:

```text
1px solid #E5E7EB
```

Use stronger borders only for:

- focused elements
- selected components
- important state boundaries
- interactive controls

---

# 10. Shadows

Use shadows minimally.

Preferred hierarchy:

```text
Default cards:
No shadow or extremely subtle shadow

Dropdown:
Subtle shadow

Modal:
Moderate shadow
```

Avoid large floating shadows.

Cards should primarily appear as structured surfaces rather than floating objects.

---

# 11. Layout

Desktop-first.

Primary application structure:

```text
┌─────────────────────────────────────────────┐
│ Sidebar │ Main Application                   │
│         │                                    │
│         │ Header                             │
│         │                                    │
│         │ Page Content                       │
│         │                                    │
└─────────────────────────────────────────────┘
```

Sidebar:

- fixed/persistent on desktop
- collapsible on smaller screens

Main content:

- flexible width
- maximum readable content width where appropriate
- consistent horizontal padding

---

# 12. Sidebar

The sidebar should establish the product identity.

Characteristics:

- dark
- professional
- compact
- structured
- low visual noise

Navigation hierarchy:

```text
MONITORING

Dashboard
Devices
Telemetry
Alarms

SYSTEM

Settings
About
```

The active item should use a subtle surface/background indicator.

Avoid oversized navigation buttons.

---

# 13. Header

The main content header should contain:

- page title
- contextual description
- system/device state where appropriate

Example:

```text
Dashboard

Overview of gas detection system

                         ● System Online
```

Do not place excessive controls in the header.

---

# 14. Cards

Cards are used to group related information.

A card should have:

```text
Title
Primary information
Supporting information
Optional action
```

Example:

```text
GAS LEVEL (MQ-2)

428 ADC

↓ 4.2% from previous period
```

Cards must not become independent visual islands with excessive decoration.

---

# 15. Metric Cards

Metric cards should answer one question.

Examples:

```text
GAS STATUS
What is the current gas state?

GAS LEVEL
What is the current sensor value?

DEVICE STATUS
Is the device communicating?

ACTIVE ALARM
Is there an unresolved alarm?
```

Do not place unrelated metrics inside one card.

---

# 16. Status Components

Standard status representation:

```text
● NORMAL
● WARNING
● DANGER
● OFFLINE
```

Components:

```text
StatusIndicator
StatusBadge
StatusLabel
```

All state components should derive from the same semantic state model.

Do not independently define colors for every page.

---

# 17. Buttons

Primary buttons should be visually clear but restrained.

Variants:

```text
Primary
Secondary
Ghost
Danger
```

Buttons should have:

- clear labels
- consistent height
- 8px radius
- visible focus state

Avoid icon-only buttons unless the icon meaning is universally obvious.

---

# 18. Inputs

Inputs should use:

- white/light surface
- subtle border
- 8px radius
- visible focus state
- readable labels

Do not rely exclusively on placeholder text.

---

# 19. Badges

Badges are appropriate for:

- status
- severity
- device state
- compact categorical information

They should not be used for every piece of information.

Example:

```text
● ONLINE
WARNING
DANGER
```

Avoid turning the interface into a collection of pills.

---

# 20. Charts

Telemetry charts are core product components.

Chart design must prioritize:

- readability
- trend recognition
- threshold visibility
- time interpretation

Required characteristics:

- time-based X-axis
- numerical Y-axis
- tooltip
- readable labels
- warning threshold
- danger threshold
- responsive resizing

Avoid:

- excessive gradients
- glow
- 3D charts
- decorative fills
- unnecessary animation

---

# 21. Threshold Visualization

Thresholds must be visually distinct.

Conceptually:

```text
Danger ─────────────────────
Warning ────────────────────

       telemetry
      ╭────╮
──────╯    ╰────────────
```

The threshold lines should remain visually subordinate to the actual telemetry line while still being easy to identify.

---

# 22. Tables

Tables are used for:

- alarms
- events
- telemetry records
- devices where appropriate

Table requirements:

- readable column hierarchy
- subtle row separators
- clear status indicators
- consistent alignment
- timestamp formatting
- responsive behavior

Do not make tables visually heavy.

---

# 23. Empty States

Empty states must communicate why the section is empty.

Example:

```text
No active alarms

The system currently has no unresolved gas alarms.
```

Do not use decorative illustrations unless they provide real value.

---

# 24. Loading States

Use restrained skeleton/loading indicators.

Do not create elaborate loading animations.

Loading should preserve the expected layout structure.

---

# 25. Error States

Errors should be explicit.

Example:

```text
Unable to load telemetry

The latest telemetry data could not be retrieved.

[Retry]
```

Do not silently show empty values when data failed to load.

---

# 26. Offline State

Offline state must communicate:

- device identity
- last known communication time
- current inability to receive new telemetry

Example:

```text
● OFFLINE

GAS-001

Last seen 4 minutes ago
```

Do not show stale telemetry as if it were live.

---

# 27. Motion

Motion should communicate state or interaction.

Allowed:

- chart transition
- status transition
- hover/focus
- navigation transition
- subtle live telemetry update

Avoid:

- animated backgrounds
- particles
- floating cards
- excessive entrance animations
- decorative motion

Principle:

> Motion communicates function, not decoration.

---

# 28. Iconography

Use **Lucide React**.

Icons should:

- remain visually consistent
- generally use stroke icons
- have consistent sizing
- support the text rather than replace it

Recommended sizes:

```text
16px
18px
20px
24px
```

Avoid mixing multiple icon libraries.

---

# 29. Responsive Behavior

Desktop:

```text
Persistent sidebar
Multi-column metrics
Large telemetry chart
```

Tablet:

```text
Collapsible sidebar
Reduced grid columns
```

Mobile:

```text
Collapsed navigation
Stacked metrics
Responsive chart
Scrollable/stacked tables
```

Do not simply scale the desktop interface down.

---

# 30. Accessibility

Required:

- semantic HTML
- keyboard navigation
- visible focus states
- sufficient contrast
- accessible labels
- descriptive interactive controls
- status text in addition to color

Critical states must remain understandable without color perception.

---

# 31. Anti-AI-Slop Rules

Explicitly prohibited as a default visual direction:

```text
Purple gradient hero sections
Blue/purple AI gradients
Glassmorphism
Neon glow
Huge rounded cards
Excessive pill UI
3D illustrations
Floating objects
Particle effects
Animated backgrounds
Excessive blur
Excessive shadows
Futuristic fonts
Decorative dashboards
```

GasMonitor should look like software built for engineering and monitoring operations.

---

# 32. Design Quality Test

Before considering a page complete, evaluate:

- Can the current system state be identified immediately?
- Is the most important measurement visually dominant?
- Are warning and danger states obvious?
- Is normal operation visually calm?
- Can telemetry trends be understood quickly?
- Is the interface unnecessarily decorative?
- Are spacing and typography consistent?
- Does the page look like the same product as the other pages?

If not, revise the design.

---

# 33. Final Design Principle

GasMonitor should communicate:

> "This is a reliable technical monitoring interface."

It should not communicate:

> "This is an AI-generated dashboard."