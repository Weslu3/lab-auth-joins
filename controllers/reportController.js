const db = require('../config/db'); // adjust path if needed

// A) INNER JOIN
exports.usersWithRoles = (req, res) => {
  const sql = `
    SELECT u.id AS uid, u.email, r.role_name
    FROM users u
    INNER JOIN user_roles ur ON u.id = ur.user_id
    INNER JOIN roles r ON r.id = ur.role_id
    ORDER BY u.id, r.role_name;
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// B) LEFT JOIN
exports.usersWithProfiles = (req, res) => {
  const sql = `
    SELECT u.id AS uid, u.email, p.phone, p.city, p.country
    FROM users u
    LEFT JOIN profiles p ON p.user_id = u.id
    ORDER BY u.id;
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// C) RIGHT JOIN
exports.rolesWithUsers = (req, res) => {
  const sql = `
    SELECT r.role_name, u.id AS user_id, u.email
    FROM users u
    RIGHT JOIN user_roles ur ON u.id = ur.user_id
    RIGHT JOIN roles r ON r.id = ur.role_id
    ORDER BY r.role_name, user_id;
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// D) FULL OUTER JOIN
exports.fullOuterJoinProfiles = (req, res) => {
  const sql = `
    SELECT u.id AS uid, u.email, p.id AS profile_id, p.city
    FROM users u
    LEFT JOIN profiles p ON p.user_id = u.id
    UNION
    SELECT u.id AS uid, u.email, p.id AS profile_id, p.city
    FROM users u
    RIGHT JOIN profiles p ON p.user_id = u.id
    ORDER BY uid;
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// E) CROSS JOIN
exports.crossJoinUsersRoles = (req, res) => {
  const sql = `
    SELECT u.id AS uid, u.email, r.role_name
    FROM users u
    CROSS JOIN roles r
    ORDER BY u.id, r.role_name;
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// F) SELF JOIN
exports.userReferrals = (req, res) => {
  const sql = `
    SELECT ref.referrer_user_id, ur1.email AS referrer_email,
           ref.referred_user_id, ur2.email AS referred_email,
           ref.referred_at
    FROM referrals ref
    INNER JOIN users ur1 ON ur1.id = ref.referrer_user_id
    INNER JOIN users ur2 ON ur2.id = ref.referred_user_id
    ORDER BY ref.referred_at DESC;
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// G) Bonus
exports.latestLoginPerUser = (req, res) => {
  const sql = `
    SELECT u.id AS uid, u.email, la.ip_address, la.occurred_at
    FROM users u
    LEFT JOIN (
        SELECT user_id, ip_address, occurred_at
        FROM login_audit la1
        WHERE occurred_at = (
            SELECT MAX(occurred_at)
            FROM login_audit la2
            WHERE la2.user_id = la1.user_id
        )
    ) la ON la.user_id = u.id
    ORDER BY u.id;
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};
