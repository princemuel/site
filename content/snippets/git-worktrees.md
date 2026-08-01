---
title: Git worktrees
description: Workflow for using git worktrees
date: "2026-07-15T03:29:52Z"
published: "draft"
priotity: 2
tags:
  - typescript
  - generators
  - iterators
  - utility
category: snippets
language: typescript
---

In order to use the worktrees feature in git, the repo needs to be a bare repository.

```sh
# creating a new repository
git init bare .

# cloning an existing repository
git clone --bare <remote:url>
```

Worktree commands

```bash
# Add a new worktree for an existing branch
git worktree add path/to/dir <existing-branch-name>

# Create worktree for a new branch from an existing branch
git worktree add -b <new-branch-name> path/to/dir <existing-branch-name>

# Remove a worktree
git worktree remove path/to/dir

# List all worktrees
git worktree list
```

I can never remember this shit...
