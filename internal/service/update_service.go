package service

import (
	"encoding/json"
	"fmt"
	"gbvsr-matchup-notes/internal/config"
	"gbvsr-matchup-notes/internal/models"
	"io"
	"net/http"
	"strings"
	"time"
)

// UpdateService handles update checking logic
type UpdateService struct {
	currentVersion string
	repoURL        string
	httpClient     *http.Client
}

// NewUpdateService creates a new update service
func NewUpdateService() *UpdateService {
	cfg := config.GetConfig()
	
	return &UpdateService{
		currentVersion: cfg.App.Version,
		repoURL:        cfg.App.Repository,
		httpClient: &http.Client{
			Timeout: 5 * time.Second,
		},
	}
}

// GitHubRelease represents the GitHub API release response
type GitHubRelease struct {
	TagName string `json:"tag_name"`
	HTMLURL string `json:"html_url"`
	Name    string `json:"name"`
	Body    string `json:"body"`
}

// CheckForUpdates checks GitHub for the latest release
func (s *UpdateService) CheckForUpdates() (*models.UpdateInfo, error) {
	// Extract owner/repo from repository URL
	apiURL, err := s.getGitHubAPIURL()
	if err != nil {
		return &models.UpdateInfo{
			CurrentVersion:    s.currentVersion,
			LatestVersion:     "",
			UpdateURL:         "",
			IsUpdateAvailable: false,
			Message:           fmt.Sprintf("Error: %s", err.Error()),
		}, err
	}

	// Make API request
	resp, err := s.httpClient.Get(apiURL)
	if err != nil {
		return &models.UpdateInfo{
			CurrentVersion:    s.currentVersion,
			LatestVersion:     "",
			UpdateURL:         "",
			IsUpdateAvailable: false,
			Message:           "Unable to check for updates (network error)",
		}, err
	}
	defer resp.Body.Close()

	if resp.StatusCode == 404 {
		return &models.UpdateInfo{
			CurrentVersion:    s.currentVersion,
			LatestVersion:     "",
			UpdateURL:         "",
			IsUpdateAvailable: false,
			Message:           "Failed to fetch release info from GitHub",
		}, fmt.Errorf("repository not found")
	}

	if resp.StatusCode == 403 {
		return &models.UpdateInfo{
			CurrentVersion:    s.currentVersion,
			LatestVersion:     "",
			UpdateURL:         "",
			IsUpdateAvailable: false,
			Message:           "GitHub API rate limit exceeded. Try again later.",
		}, fmt.Errorf("rate limit exceeded")
	}

	if resp.StatusCode != 200 {
		return &models.UpdateInfo{
			CurrentVersion:    s.currentVersion,
			LatestVersion:     "",
			UpdateURL:         "",
			IsUpdateAvailable: false,
			Message:           fmt.Sprintf("Failed to fetch release info (status %d)", resp.StatusCode),
		}, fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	// Parse response
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return &models.UpdateInfo{
			CurrentVersion:    s.currentVersion,
			LatestVersion:     "",
			UpdateURL:         "",
			IsUpdateAvailable: false,
			Message:           "Failed to read release info",
		}, err
	}

	var release GitHubRelease
	if err := json.Unmarshal(body, &release); err != nil {
		return &models.UpdateInfo{
			CurrentVersion:    s.currentVersion,
			LatestVersion:     "",
			UpdateURL:         "",
			IsUpdateAvailable: false,
			Message:           "Failed to parse release info",
		}, err
	}

	// Compare versions
	latestVersion := strings.TrimPrefix(release.TagName, "v")
	currentVersion := strings.TrimPrefix(s.currentVersion, "v")
	
	isNewer := s.isVersionNewer(latestVersion, currentVersion)

	if isNewer {
		return &models.UpdateInfo{
			CurrentVersion:    s.currentVersion,
			LatestVersion:     release.TagName,
			UpdateURL:         release.HTMLURL,
			IsUpdateAvailable: true,
			Message:           fmt.Sprintf("Update available: %s → %s", s.currentVersion, release.TagName),
		}, nil
	}

	return &models.UpdateInfo{
		CurrentVersion:    s.currentVersion,
		LatestVersion:     release.TagName,
		UpdateURL:         release.HTMLURL,
		IsUpdateAvailable: false,
		Message:           fmt.Sprintf("You're up to date! (%s)", s.currentVersion),
	}, nil
}

// getGitHubAPIURL converts repository URL to API URL
func (s *UpdateService) getGitHubAPIURL() (string, error) {
	// Example: https://github.com/user/repo -> https://api.github.com/repos/user/repo/releases/latest
	repoURL := strings.TrimSuffix(s.repoURL, "/")
	
	if !strings.Contains(repoURL, "github.com") {
		return "", fmt.Errorf("only GitHub repositories are supported")
	}

	parts := strings.Split(repoURL, "github.com/")
	if len(parts) != 2 {
		return "", fmt.Errorf("invalid GitHub repository URL")
	}

	ownerRepo := parts[1]
	return fmt.Sprintf("https://api.github.com/repos/%s/releases/latest", ownerRepo), nil
}

// isVersionNewer compares two semantic versions
func (s *UpdateService) isVersionNewer(latest, current string) bool {
	// Simple string comparison for now
	// In production, use a proper semver library
	return latest > current
}
