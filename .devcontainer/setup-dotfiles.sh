#!/usr/bin/env zsh
set -euo pipefail

dotfiles_repo_url="${DOTFILES_REPO_URL:-https://github.com/sugawarahirotaka/dotfiles.git}"
dotfiles_dir="${DOTFILES_DIR:-$HOME/.dotfiles}"
install_stamp="$HOME/.cache/devcontainer/dotfiles-install.stamp"

mkdir -p "$(dirname "$install_stamp")"

link_dotfile() {
    local target_name="$1"
    local source_path=""
    local candidate
    local timestamp

    for candidate in \
        "$dotfiles_dir/$target_name" \
        "$dotfiles_dir/home/$target_name" \
        "$dotfiles_dir/zsh/$target_name" \
        "$dotfiles_dir/${target_name#.}" \
        "$dotfiles_dir/home/${target_name#.}" \
        "$dotfiles_dir/zsh/${target_name#.}" \
        "$dotfiles_dir/dot_${target_name#.}"; do
        if [ -e "$candidate" ]; then
            source_path="$candidate"
            break
        fi
    done

    if [ -z "$source_path" ]; then
        return
    fi

    if [ -e "$HOME/$target_name" ] && [ ! -L "$HOME/$target_name" ]; then
        timestamp="$(date +%Y%m%d%H%M%S)"
        mv "$HOME/$target_name" "$HOME/$target_name.devcontainer-backup-$timestamp"
    fi

    ln -sfn "$source_path" "$HOME/$target_name"
}

if [ -d "$dotfiles_dir/.git" ]; then
    git -C "$dotfiles_dir" remote set-url origin "$dotfiles_repo_url"
    git -C "$dotfiles_dir" fetch --prune origin
    git -C "$dotfiles_dir" pull --ff-only || true
elif [ -e "$dotfiles_dir" ]; then
    echo "$dotfiles_dir exists but is not a Git repository." >&2
    echo "Move it away or set DOTFILES_DIR to another path." >&2
    exit 1
else
    git clone "$dotfiles_repo_url" "$dotfiles_dir"
fi

# Keep the checkout usable for reads/updates while making accidental pushes fail.
git -C "$dotfiles_dir" remote set-url --push origin DISABLED_PUSH_URL
git -C "$dotfiles_dir" config url.https://github.com/.insteadOf git@github.com:
git -C "$dotfiles_dir" submodule sync --recursive
git -C "$dotfiles_dir" -c url.https://github.com/.insteadOf=git@github.com: submodule update --init --recursive

if [ -e "$HOME/dotfiles" ] && [ ! -L "$HOME/dotfiles" ]; then
    timestamp="$(date +%Y%m%d%H%M%S)"
    mv "$HOME/dotfiles" "$HOME/dotfiles.devcontainer-backup-$timestamp"
fi
ln -sfn "$dotfiles_dir" "$HOME/dotfiles"

if [ ! -f "$dotfiles_dir/.zshrc.private" ]; then
    : > "$dotfiles_dir/.zshrc.private"
fi

if [ ! -f "$install_stamp" ]; then
    for installer in install.sh bootstrap.sh setup.sh; do
        if [ -f "$dotfiles_dir/$installer" ]; then
            zsh "$dotfiles_dir/$installer"
            touch "$install_stamp"
            break
        fi
    done
fi

for dotfile in .zshenv .zprofile .zshrc .zlogin .zlogout .p10k.zsh; do
    link_dotfile "$dotfile"
done
