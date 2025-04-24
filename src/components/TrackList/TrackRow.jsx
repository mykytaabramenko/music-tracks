import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, IconButton, TableCell, TableRow } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";

import defaultCoverImage from "../../assets/default-track-cover-img.png";
import DeleteDialog from "./DeleteDialog.jsx";
import useAudioEffects from "./useAudioEffects.js";
import PlaybackProgress from "./PlaybackProgress.jsx";
import useDeleteTrackMutation from "../../hooks/useDeleteTrackMutation.js";
import { PlaybackStates } from "../../constants.js";

export function TrackRow({ track }) {
  const { id, title, artist, album, genres, slug, coverImage } = track;
  let { audioFile } = track;
  // temp solution, because there is no API for loading of track
  if (audioFile) {
    audioFile = "https://samplelib.com/lib/preview/mp3/sample-15s.mp3";
  }
  const location = useLocation();
  const navigate = useNavigate();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const { playbackData, setPlaybackData, audioRef, setCurrentId } =
    useAudioEffects(audioFile, id);

  const isPlaying = playbackData.state === "playing";

  const deleteMutation = useDeleteTrackMutation(id);

  function handlePlayButtonClick() {
    if (!audioFile) return;
    const audio = audioRef.current;
    if (!playbackData.state) {
      setCurrentId(id);
      setPlaybackData((prev) => ({ ...prev, state: PlaybackStates.PLAYING }));
      audio.play();
    }
    if (playbackData.state === PlaybackStates.PLAYING) {
      setPlaybackData((prev) => ({ ...prev, state: PlaybackStates.PAUSED }));
      audio.pause();
    }
    if (playbackData.state === PlaybackStates.PAUSED) {
      setPlaybackData((prev) => ({ ...prev, state: PlaybackStates.PLAYING }));
      audio.play();
    }
    if (playbackData.state === PlaybackStates.ENDED) {
      setPlaybackData({ progress: 0, state: PlaybackStates.PLAYING });
      audio.currentTime = 0;
      audio.play();
    }
  }

  function handleEditButtonClick(e, trackSlug) {
    e.stopPropagation();
    navigate(`/tracks/${trackSlug}/edit`, {
      state: {
        background: {
          pathname: location.pathname,
          search: location.search,
          hash: location.hash,
        },
      },
    });
  }

  function handleDeleteButtonClick(e) {
    e.stopPropagation();
    setConfirmDeleteOpen(true);
  }

  async function handleConfirmDelete() {
    await deleteMutation.mutate();
    setConfirmDeleteOpen(false);
  }

  function handleCancelDelete() {
    setConfirmDeleteOpen(false);
  }

  function renderAudioIcon() {
    if (isPlaying) return <PauseIcon data-testid={`pause-button-${id}`} />;
    return <PlayArrowIcon data-testid={`play-button-${id}`} />;
  }

  const shouldShowProgress = [
    PlaybackStates.PLAYING,
    PlaybackStates.PAUSED,
    PlaybackStates.ENDED,
  ].includes(playbackData.state);

  return (
    <>
      <TableRow
        key={track.id}
        sx={{
          position: "relative",
        }}
        data-testid={`track-item-${id}`}
      >
        <TableCell data-testid={`track-item-${id}-title`}>
          {audioFile && (
            <IconButton
              onClick={handlePlayButtonClick}
              data-testid={`audio-player-${id}`}
            >
              {renderAudioIcon()}
            </IconButton>
          )}
        </TableCell>
        <TableCell
          sx={{ position: "relative", width: 80, p: 1 }}
          align={"center"}
        >
          <Box
            component="img"
            src={coverImage || defaultCoverImage}
            alt={`${title} cover`}
            sx={{
              width: 50,
              height: 50,
              objectFit: "cover",
              borderRadius: 2,
            }}
            data-testid={`track-item-${track.id}-cover`}
          />
        </TableCell>
        <TableCell data-testid={`track-item-${id}-title`}>{title}</TableCell>
        <TableCell data-testid={`track-item-${id}-artist`}>{artist}</TableCell>
        <TableCell>{album || "-"}</TableCell>
        <TableCell>{genres.join(", ") || "-"}</TableCell>
        <TableCell align={"center"}>
          <IconButton
            data-testid={`edit-track-${id}`}
            onClick={(e) => handleEditButtonClick(e, slug)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            data-testid={`delete-track-${id}`}
            onClick={handleDeleteButtonClick}
          >
            <DeleteIcon />
          </IconButton>
        </TableCell>
        {shouldShowProgress && (
          <PlaybackProgress progress={playbackData.progress} id={id} />
        )}
      </TableRow>
      <DeleteDialog
        open={confirmDeleteOpen}
        onClose={handleCancelDelete}
        onConfirmDelete={handleConfirmDelete}
        title={title}
      />
    </>
  );
}

export default TrackRow;
