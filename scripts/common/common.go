package common

var Roster = []string{
	// Row 1
	"Zeta", "Vaseraga", "Beatrix", "Eustace", "Anre", "Seox", "Lancelot", "Vane", "Percival", "Siegfried",
	// Row 2
	"Versusia", "Zooey", "Ladiva", "Narmaya", "Gran", "Djeeta", "Charlotta", "Ferry", "Anila", "Vikala",
	// Row 3
	"Galleon", "Grimnir", "Metera", "Lowain", "Katalina", "Vira", "Yuel", "Soriz", "Cagliostro", "Wilnas",
	// Row 4
	"Ilsa", "Sandalphon", "Nier", "Belial", "Beelzebub", "Lucilius", "Avatar Belial", "2B", "Meg",
	// EX variants
	"Narmaya (EX)", "Gran (EX)", "Djeeta (EX)",
}

type MoveData struct {
	MoveName     string   `json:"name"`
	Input        string   `json:"input"`
	Damage       string   `json:"damage"`
	Guard        string   `json:"guard"`
	Startup      string   `json:"startup"`
	Active       string   `json:"active"`
	Recovery     string   `json:"recovery"`
	OnBlock      string   `json:"onBlock"`
	OnHit        string   `json:"onHit"`
	OnCounterhit string   `json:"onCH"`
	MeterChange  string   `json:"meter"`
	ClashLevel   string   `json:"cls"`
	Images       []string `json:"images"`
	Hitboxes     []string `json:"hitboxes"`
	Type         string   `json:"type"`
}
