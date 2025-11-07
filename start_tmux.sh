#!/bin/bash

tmux set-option -g default-command "bash -l"
tmux new-session -d -s root "bash -l"
tmux split-window -h -t root "node PATH_TO_streamers.js"
tmux resize-pane -x 10 -t root:0.1
tmux set-option -g status-position top
tmux set-option -g status-right "#[bold]%d-%m-%Y  %H:%M"
tmux select-pane -t root:0.0
tmux attach -t root

